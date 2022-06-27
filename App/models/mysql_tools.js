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
async function getAllData(database, table, condition = "", limitstart = 0, limitstop = 0) {
    return new Promise((resolve, reject) => {
        let queryString =
            `SELECT * FROM ${database}.${table}`;
        if (condition) {
            queryString += " WHERE " + condition;
        }
        if (limitstop > 0) {
            queryString += " LIMIT " + limitstart + ", " + (limitstop-limitstart);
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
async function getColumnArrayOfData(database, table, columns, condition = "", limitstart = 0, limitstop = 0) {
    return new Promise((resolve, reject) => {
        let queryString =
            `SELECT ${columns} FROM ${database}.${table}`;
        if (condition) {
            queryString += " WHERE " + condition;
        }
        if (limitstop > 0) {
            queryString += " LIMIT " + limitstart + ',' + (limitstop-limitstart);
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
async function logDataByColumn(database, table, columns, condition = "", limitstart = 0, limitstop = 0) {
    console.log(await getColumnArrayOfData(database, table, columns, condition, limitstart, limitstop));
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

async function readColumnArrayOfUpdatedData(table, columns, condition = "", limitstart = 0, limitstop = 0) {
    return new Promise((resolve, reject) => {
        let queryString =
            "SELECT " + columns + " FROM " + table;
        if (condition) {
            queryString += " WHERE " + condition;
        }
        if (limitstop > 0) {
            queryString += " LIMIT " + limitstart + ',' + (limitstop-limitstart);
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

let mysql_tools = {};
mysql_tools.endOrignalConnection = endOriginalConnection;
mysql_tools.getAllData = getAllData;
mysql_tools.getColumnArrayOfData = getColumnArrayOfData;
mysql_tools.logAllData = logAllData;
mysql_tools.logDataByColumn = logDataByColumn;
mysql_tools.writeColumn = writeColumn;
mysql_tools.endUpdatedConnection = endUpdatedConnection;
mysql_tools.readColumnArrayOfUpdatedData = readColumnArrayOfUpdatedData;


module.exports = mysql_tools;
