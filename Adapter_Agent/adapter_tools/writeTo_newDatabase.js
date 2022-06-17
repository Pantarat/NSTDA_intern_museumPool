const mysql_tools = require('./mysql_tools');
const mysql = require('mysql');

//Need to change connection properties here
var readConProp = {
    host: '',
    user: '',
    password: '',
    database: ''
}
var writeConProp = {
    host: '',
    user: '',
    password: '',
    database: ''
}

function makeReadConnection([host, user, password, database]){
    readConProp.host = host,
    readConProp.user = user,
    readConProp.password = password,
    readConProp.database = database
    mysql_tools.makeReadConnection(Object.values(readConProp));
}

function makeWriteConnection([host, user, password, database]){
    writeConProp.host = host,
    writeConProp.user = user,
    writeConProp.password = password,
    writeConProp.database = database
    mysql_tools.makeWriteConnection(Object.values(writeConProp));
}


function getObject_PopData() {
    var newdbRead = mysql.createConnection(readConProp);
    return new Promise((resolve, reject) => {
        let queryString = `SELECT Object_Code, Place_Code, VisitorLog_UpdDate, VisitorLog_ID FROM visitorlog JOIN object ON visitorlog.Object_ID = object.Object_ID`;
        newdbRead.query(queryString, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(JSON.stringify(results)));
            }
        })
    })
}

function writeObject_Pop(data) {
    //setup properties of table
    //dbwriteCon.query('ALTER TABLE object_population DROP PRIMARY KEY, MODIFY id INT AUTO_INCREMENT UNIQUE, ADD COLUMN VisitorLog_ID INT PRIMARY KEY NOT NULL')

    mysql_tools.writeColumn('object_population', ['Object_Code', 'Place_Code', 'Visited_Time', 'VisitorLog_ID'], data);
}

function getVisitor_LogData() {
    return new Promise((resolve, reject) => {
        var newdbRead = mysql.createConnection(readConProp);
        let queryString = `SELECT Visitor_ID,VisitorLog_UpdDate,Object_Code,place.Place_Code,VisitorLog_ID FROM visitorlog LEFT JOIN place ON visitorlog.Place_MuseumID = place.Place_ID LEFT JOIN object ON object.Object_ID = visitorlog.Object_ID`;
        newdbRead.query(queryString, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(JSON.stringify(results)));
            }
        });
    });
}

function writeVisitor_Log(data) {
    //setup properties of table
    //dbwriteCon.query('ALTER TABLE visitor_log DROP PRIMARY KEY, MODIFY id INT AUTO_INCREMENT UNIQUE, ADD COLUMN VisitorLog_ID INT PRIMARY KEY NOT NULL');
    mysql_tools.writeColumn("visitor_log", ["Visitor_ID", "VisitorLog_UpdDate", "Object_Code", "Place_Code", "VisitorLog_ID",], data);
}

function pullAllVisitor_Log() {
    getVisitor_LogData().then((result) => {
        writeVisitor_Log(result);
    });
}

function pullAllObject_Pop() {
    getObject_PopData()
        .then(result => {
            writeObject_Pop(result);
        })
}

var allexports = {};
allexports.makeReadConnection = makeReadConnection;
allexports.makeWriteConnection = makeWriteConnection;
allexports.getObject_PopData = getObject_PopData;
allexports.writeObject_PopData = writeObject_Pop;
allexports.pullAllObject_Pop = pullAllObject_Pop;
allexports.getVisitor_LogData = getVisitor_LogData;
allexports.writeVisitor_Log = writeVisitor_Log;
allexports.pullAllVisitor_Log = pullAllVisitor_Log;

module.exports = allexports;
