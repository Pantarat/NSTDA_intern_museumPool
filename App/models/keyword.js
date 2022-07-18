const dbconfig = require('../config/db')
var request = require('request');
const dbogCon = dbconfig.dbogCon;
const dbupdCon = dbconfig.dbupdCon;
const sql_tools = require('./mysql_tools');
require('dotenv').config();

//get list of objects with id and name+description
async function getDescription(id = 0) {
    return new Promise((resolve, reject) => {
        let queryString = `SELECT id, CONCAT(name,description) AS nameWithDescript FROM ${process.env.UPDATEDDB}.object_description WHERE language = \'th-TH\' AND id = `
        if (id > 0) {
            queryString += dbupdCon.escape(id);
        }
        else {
            queryString += 'id';
        }
        dbupdCon.query(queryString, (err, result) => {
            if (err) throw err;
            if (result.length == 0) {
                reject('Error, The specified data does not exist or is not in Thai language.');
            }
            else {
                console.log('Retrieved description data');
                resolve(JSON.parse(JSON.stringify(result)));
            }
        })
    })
}

async function transformDescriptionToKeyword(descriptionObj_list, start = 0, finish = 0, numberOfKeywords = 5) {

    var options = {
        'method': 'POST',
        'url': 'https://api.aiforthai.in.th/tagsuggestion',
        'headers': {
            'Apikey': process.env.APIKEY,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'text': '',
            'numtag': numberOfKeywords
        }
    };

    // const delay_in_second = function () {
    //     return new Promise((resolve, reject) => {
    //         let delay_in_second = Math.floor(Math.random() * 10) + 2;
    //         setTimeout(resolve, delay_in_second * 10);
    //     })
    // }

    return new Promise((resolve, reject) => {
        var counter = 0;
        let objsWithKeyword = [];

        if (finish > 0) {
            descriptionObj_list = descriptionObj_list.slice(start, finish);
        }

        descriptionObj_list.forEach((object, i) => {
            setTimeout(() => {
                //cut up to 1000 characters
                let apiDescript;
                if (object.nameWithDescript.length > 1000) {
                    apiDescript = object.nameWithDescript.slice(0, 1000);
                }
                else { apiDescript = object.nameWithDescript; }

                options.form.text = apiDescript;

                //set delay

                request(options, function (error, response) {
                    if (error) throw resolve(error);
                    else {
                        for (let i = 0; i < numberOfKeywords; i++) {
                            //console.log(response.body);
                            let key = (JSON.parse(response.body).tags)[i];
                            objsWithKeyword.push(Object.assign({}, object, key));
                            counter++;
                            //console.log(Math.ceil(counter / 5));
                        }
                    }
                    if (counter === (numberOfKeywords * descriptionObj_list.length)) {
                        objsWithKeyword.forEach(obj => {
                            delete obj.nameWithDescript;
                        })
                        console.log('Got all keywords succesfully!')
                        resolve(objsWithKeyword);
                    }
                })
            }, i * 100)//delay time here

        })
    })
}

async function writeToKeyword_Table(data) {
    return new Promise((resolve, reject) => {
        let querydata = data.map((row) => {
            return { tag: row.tag };
        })
        //console.log(querydata);
        sql_tools.writeColumn('keyword', ['value'], querydata)
        setTimeout(() => {
            resolve('done');
        },5)
    })
}

async function writeToObj_Key_Relation(data) {
    await writeToKeyword_Table(data);
    return new Promise((resolve, reject) => {
        let newdata = [];
        sql_tools.readColumnArrayOfUpdatedData('keyword', ['id', 'value'])
            .then(keydata => {
                let keyword_table = keydata
                data.forEach(object => {
                    for (let i = 0; i < keyword_table.length; i++) {
                        if (object.tag == keyword_table[i].value) {
                            object.keyword_id = keyword_table[i].id
                            delete object.tag
                            break;
                        }
                    }
                    if (object.keyword_id) { newdata.push(object) }
                })
                //console.log(newdata)
                sql_tools.writeColumn('object_keyword_relation', ['object_id', 'score', 'keyword_id'], newdata);
                resolve('done')
            })
    })
}

function fillRelation(startFrom = 0) {
    let k = startFrom;
    keyword.getDescription()
        .then(data => {
            for (let i = k; i < data.length; i += 5) {
                setTimeout(() => {
                    j = i + 5;
                    console.log('Written', i, 'to', j);
                    transformDescriptionToKeyword(data, i, j)
                        .then(result => {
                            writeToObj_Key_Relation(result);
                        })
                }, (i - k) * 500)
            }
        })
}

function fillKeyword(startFrom = 0) {
    let k = startFrom;
    keyword.getDescription()
        .then(data => {
            for (let i = k; i < data.length; i += 5) {
                setTimeout(() => {
                    j = i + 5;
                    console.log('Written', i, 'to', j);
                    transformDescriptionToKeyword(data, i, j)
                        .then(result => {
                            writeToKeyword_Table(result);
                        })
                }, (i - k) * 500)
            }
        })
}

function fillKeywordWithObjID(id) {
    getDescription(id)
        .then(data => {
            transformDescriptionToKeyword(data)
                .then(result => {
                    writeToKeyword_Table(result);
                })
        })
        .catch(err => {
            console.log(err)
        })
}

function fillRelationWithObjID(id) {
    getDescription(id)
        .then(data => {
            transformDescriptionToKeyword(data)
                .then(result => {
                    writeToObj_Key_Relation(result);
                })
        })
        .catch(err => {
            console.log(err)
        })
}




keywordExports = {}

keywordExports.getDescription = getDescription;
keywordExports.transformDescriptionToKeyword = transformDescriptionToKeyword;
keywordExports.writeToKeyword_Table = writeToKeyword_Table
keywordExports.fillRelation = fillRelation;
keywordExports.fillKeyword = fillKeyword;
keywordExports.fillKeywordWithObjID = fillKeywordWithObjID;
keywordExports.fillRelationWithObjID = fillRelationWithObjID;

module.exports = keywordExports