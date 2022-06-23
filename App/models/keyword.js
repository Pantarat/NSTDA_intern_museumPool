const dbconfig = require('../config/db')
var request = require('request');
const dbogCon = dbconfig.dbogCon;
const dbupdCon = dbconfig.dbupdCon;
const mysql = require("mysql");
const sql_tools = require('./mysql_tools');
require('dotenv').config();
const sequelize = require('sequelize');

//get list of objects with id and name+description
async function getDescription(limit = 0) {
    let descriptions = await sql_tools.getColumnArrayOfData(process.env.UPDATEDDB, 'object', ['id', 'name', 'description'], 'language = \'th-TH\'', limit)

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

    return new Promise((resolve, reject) => {
        var counter = 0;
        let objsWithKeyword = [];
        descriptionObj_list.forEach((object,i) => {
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
                            let key = (JSON.parse(response.body).tags)[i];
                            objsWithKeyword.push(Object.assign({}, object, key));
                            counter++;
                            console.log(Math.ceil(counter / 5));
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
            }, i*1000)//delay time here

        })
    })
}

function writeToKeyword_Table(data) {
    let querydata = data.map((row) => {
        return { tag: row.tag };
    })
    sql_tools.writeColumn('keyword', ['value'], querydata)
}


keywordExports = {}

keywordExports.getDescription = getDescription;
keywordExports.transformDescriptionToKeyword = transformDescriptionToKeyword;
keywordExports.writeToKeyword_Table = writeToKeyword_Table

module.exports = keywordExports