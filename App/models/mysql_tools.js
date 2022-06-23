const dbconfig = require('../config/db')
const dbogCon = dbconfig.dbogCon;
const dbupdCon = dbconfig.dbupdCon;
const mysql = require("mysql");

function endOriginalConnection() {
    dbogCon.end();
}

function endUpdatedConnection() {
    dbupdCon.end();
}

//READ
//getAllData('name_Of_Table','id = 5',10) return array of json data where json key is column name
async function getAllData(database, table, condition = "", limit = 0) {
    return new Promise((resolve, reject) => {
        let queryString =
            `SELECT * FROM ${database}.${table}`;
        if (condition) {
            queryString += " WHERE " + condition;
        }
        if (limit > 0) {
            queryString += " LIMIT " + limit;
        }
        dbconfig.dbogCon.query(queryString, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(JSON.stringify(results)));
            }
        });
    });
}

//displays all data from table
async function logAllData(database, table_name) {
    console.log(await getAllData(database,table_name));
}

//return array of json data based on column where json key is column name
//getColumnArrayOfData('name_Of_Table',[column1,column2],id > 20, 5)
async function getColumnArrayOfData(database, table, columns, condition = "", limit = 0) {
    return new Promise((resolve, reject) => {
        let queryString =
            `SELECT ${columns} FROM ${database}.${table}`;
        if (condition) {
            queryString += " WHERE " + condition;
        }
        if (limit > 0) {
            queryString += " LIMIT " + limit;
        }
        dbogCon.query(queryString, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(JSON.stringify(results)));
            }
        });
    });
}

//displays data based on column
//getColumnArrayOfData('name_Of_Table',[column1,column2],id > 20, 5)
async function logDataByColumn(database, table, columns, condition = "") {
    console.log(await getColumnArrayOfData(database, table, columns, condition));
}

//WRITE
//writeColumn('name_Of_Table',[column1,column2], [ {column1:value1 , column2:value2} , {...} , ... ] )
async function writeColumn(table, columns, data) {
    let dataStr = data.map((row) => Object.values(row));
    let updateStr = "";
    for (i = 0; i < columns.length; i++) {
        let column = columns[i];
        updateStr += column + "=VALUES(" + column + "), ";
    }
    updateStr = updateStr.slice(0, -2);

    queryString =
        `INSERT INTO ${table} (${columns}) VALUES ? ON DUPLICATE KEY UPDATE ` +
        updateStr;
    dbupdCon.query(queryString, [dataStr], (error, results, fields) => {
        if (error) throw error;
        else {
            console.log("Data written succesfully");
        }
    });
}

async function readColumnArrayOfUpdatedData(table, columns, condition = "", limit = 0) {
    return new Promise((resolve, reject) => {
        let queryString =
            "SELECT " + columns + " FROM " + table;
        if (condition) {
            queryString += " WHERE " + condition;
        }
        if (limit > 0) {
            queryString += " LIMIT " + limit;
        }
        dbupdCon.query(queryString, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(JSON.stringify(results)));
            }
        });
    });
}

async function transformDescriptionToKeyword(inputString){
    // description_obj.forEach(object => {

    // })

    var request = require('request');
    var options = {
        'method': 'POST',
        'url': 'https://api.aiforthai.in.th/tagsuggestion',
        'headers': {
            'Apikey': 'X1OG75cGDnHBaStN5KevqsguLrRS5aBC',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'text': inputString,
            'numtag': '5'
        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(JSON.parse(response.body));
    });
}

let mysql_tools = {};
mysql_tools.endOrignalConnection = endOriginalConnection;
mysql_tools.getAllData = getAllData;
mysql_tools.getColumnArrayOfData = getColumnArrayOfData;
mysql_tools.logAllData = logAllData;
mysql_tools.logDataByColumn = logDataByColumn;
mysql_tools.writeColumn = writeColumn;
mysql_tools.endUpdatedConnection = endUpdatedConnection;
mysql_tools.readColumnArrayOfUpdatedData = readColumnArrayOfUpdatedData;
mysql_tools.transformDescriptionToKeyword = transformDescriptionToKeyword;

module.exports = mysql_tools;
