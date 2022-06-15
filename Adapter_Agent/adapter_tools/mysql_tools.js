const mysql = require("mysql");

var readConnectionProp = {};
var writeConnectionProp = {};
var dbConRead;
var dbConWrite;
//parameter is array for easy code use
function makeReadConnection([host, user, password, database]) {
    readConnectionProp.host = host;
    readConnectionProp.user = user;
    readConnectionProp.password = password;
    readConnectionProp.database = database;
    dbConRead = mysql.createConnection(readConnectionProp);
    dbConRead.connect();
}

function makeWriteConnection([host, user, password, database]) {
    writeConnectionProp.host = host;
    writeConnectionProp.user = user;
    writeConnectionProp.password = password;
    writeConnectionProp.database = database;
    dbConWrite = mysql.createConnection(writeConnectionProp);
    dbConWrite.connect();
}

function endReadConnection() {
    dbConRead.end();
}

function endWriteConnection() {
    dbConWrite.end();
}

//READ
function getAllData(table, condition = "", limit = 0) {
    return new Promise((resolve, reject) => {
        let queryString =
            "SELECT * FROM " + readConnectionProp.database + "." + table;
        if (condition) {
            queryString += " WHERE " + condition;
        }
        if (limit > 0) {
            queryString += " LIMIT " + limit;
        }
        dbConRead.query(queryString, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(JSON.stringify(results)));
            }
        });
    });
}

async function logAllData(table_name) {
    console.log(await getAllData(table_name));
}

function getColumnArrayOfData(table, columns, condition = "", limit = 0) {
    return new Promise((resolve, reject) => {
        let queryString =
            "SELECT " +
            columns +
            " FROM " +
            readConnectionProp.database +
            "." +
            table;
        if (condition) {
            queryString += " WHERE " + condition;
        }
        if (limit > 0) {
            queryString += " LIMIT " + limit;
        }
        dbConRead.query(queryString, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(JSON.stringify(results)));
            }
        });
    });
}

async function logDataByColumn(table, columns, condition = "") {
    console.log(await getColumnArrayOfData(table, columns, condition));
}

//WRITE
function writeColumn(table, columns, data) {
    let dataStr = data.map((row) => Object.values(row));
    let updateStr = "";
    for (i = 0; i < columns.length; i++) {
        let column = columns[i];
        updateStr += column + "=VALUES(" + column + "), ";
    }
    updateStr = updateStr.slice(0, -2);

    queryString =
        `INSERT INTO ${writeConnectionProp.database}.${table} (${columns}) VALUES ? ON DUPLICATE KEY UPDATE ` +
        updateStr;
    dbConWrite.query(queryString, [dataStr], (error, results, fields) => {
        if (error) throw error;
        else {
            console.log("Data written succesfully");
        }
    });
}

let mysql_tools = {};
mysql_tools.makeReadConnection = makeReadConnection;
mysql_tools.endReadConnection = endReadConnection;
mysql_tools.getAllData = getAllData;
mysql_tools.getColumnArrayOfData = getColumnArrayOfData;
mysql_tools.logAllData = logAllData;
mysql_tools.logDataByColumn = logDataByColumn;
mysql_tools.writeColumn = writeColumn;
mysql_tools.makeWriteConnection = makeWriteConnection;
mysql_tools.endWriteConnection = endWriteConnection;

module.exports = mysql_tools;
