const mysql = require('mysql');

var connectionProp = {}
connectionProp.host = '';
connectionProp.user = '';
connectionProp.password = '';
connectionProp.database = '';
var dbCon;

function makeConnection(host, user, password, database){
    connectionProp.host = host;
    connectionProp.user = user;
    connectionProp.password = password;
    connectionProp.database = database;
    dbCon = mysql.createConnection(connectionProp);
    dbCon.connect();
}

function getAllData(table){
    return new Promise((resolve,reject) => {
        let queryString = 'SELECT * FROM ' + connectionProp.database + '.' + table;
        dbCon.query(queryString, (error,results,fields) => {
            if (error){
                reject(error);
            }else {
                resolve(results);
            }
        })    
    })
}

function getDataArray(table,columns){
    return new Promise((resolve,reject) => {
        let queryString = 'SELECT ' + columns + 'FROM ' + connectionProp.database + '.' + table;
        dbCon.query(queryString, (error,results,fields) => {
            if (error){
                reject(error);
            }else {
                resolve(results);
            }
        })    
    }) 
}

async function logAllData(table_name) {
    console.log(await getAllData(table_name));
}

function getColumnArrayOfData(table,columns){
    return new Promise((resolve,reject) => {
        let queryString = 'SELECT ' + columns + ' FROM ' + connectionProp.database + '.' + table + ' LIMIT 5';
        dbCon.query(queryString, (error,results,fields) => {
            if (error){
                reject(error);
            }else {
                
                resolve(JSON.parse(JSON.stringify(results)));
            }
        })    
    })
}

async function logDataByColumn(table,columns){
    console.log(await getColumnArrayOfData(table,columns));
}


let getData = {};
getData.makeConnection = makeConnection;
getData.getAllData = getAllData;
getData.logAllData = logAllData;
getData.getColumnArrayOfData = getColumnArrayOfData;
getData.logDataByColumn = logDataByColumn;

module.exports = getData;