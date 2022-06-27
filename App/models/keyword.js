const dbconfig = require('../config/db')
var request = require('request');
const dbogCon = dbconfig.dbogCon;
const dbupdCon = dbconfig.dbupdCon;
const mysql = require("mysql");
const sql_tools = require('./mysql_tools');
require('dotenv').config();
const sequelize = require('sequelize');

//get list of objects with id and name+description
async function getDescription(limitstart = 0, limitstop = 0) {
    let descriptions = await sql_tools.getColumnArrayOfData(process.env.UPDATEDDB, 'object', ['id', 'name', 'description'], 'language = \'th-TH\'', limitstart, limitstop);

    let newDesList = descriptions.map((description) => {
        let newDesObj = {}
        newDesObj.id = description.id;
        newDesObj.nameWithDescript = description.name + description.description;
        return newDesObj;
    })
    console.log('Retrieved description data');
    return newDesList;
}

async function transformDescriptionToKeyword(descriptionObj_list, numberOfKeywords = 5) {

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

    const delay_in_second = function () {
        return new Promise((resolve, reject) => {
            let delay_in_second = Math.floor(Math.random() * 10) + 2;
            setTimeout(resolve, delay_in_second * 10);
        })
    }

    return new Promise((resolve, reject) => {
        var counter = 0;
        let objsWithKeyword = [];
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
        sql_tools.writeColumn('keyword', ['value'], querydata)

        resolve('done');
    })
}

async function writeToObj_Key_Relation(data) {
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
                    if(object.keyword_id){newdata.push(object)}
                })
                //console.log(newdata)
                sql_tools.writeColumn('object_keyword_relation', ['object_id', 'score', 'keyword_id'], newdata);
                resolve('done')
            })
    })
}

function fillKeyword(start, stop) {
    keyword.getDescription(start, stop)
        .then(data => {
            keyword.transformDescriptionToKeyword(data).then(async (result) => {
                await keyword.writeToKeyword_Table(result)
            })
        })
}

function fillRelation(start, stop){
    keyword.getDescription(start, stop)
        .then(data => {
            keyword.transformDescriptionToKeyword(data).then(async (result) => {
                keyword.writeToObj_Key_Relation(result)
            })
        })
}

function fillKeywordAndRelation(start, stop) {
    keyword.getDescription(start, stop)
        .then(data => {
            keyword.transformDescriptionToKeyword(data).then(async (result) => {
                await keyword.writeToKeyword_Table(result)
                //console.log(result);
                keyword.writeToObj_Key_Relation(result)
            })
        })
}




keywordExports = {}

keywordExports.getDescription = getDescription;
keywordExports.transformDescriptionToKeyword = transformDescriptionToKeyword;
keywordExports.writeToKeyword_Table = writeToKeyword_Table
keywordExports.writeToObj_Key_Relation = writeToObj_Key_Relation;
keywordExports.fillKeywordAndRelation = fillKeywordAndRelation;
keywordExports.fillKeyword = fillKeyword;
keywordExports.fillRelation = fillRelation;

module.exports = keywordExports