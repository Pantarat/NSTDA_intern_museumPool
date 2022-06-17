const {dbReadCon: dbReadCon, dbWriteCon: dbWriteCon} = require('../config/db')
const mysql_tools = require('./mysql_tools');

function getObject_PopData() {
    return new Promise((resolve, reject) => {
        let queryString = `SELECT VisitorLog_ID, Object_Code, Place_Code, VisitorLog_UpdDate FROM visitorlog JOIN object ON visitorlog.Object_ID = object.Object_ID`;
        dbReadCon.query(queryString, (error, results, fields) => {
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

    mysql_tools.writeColumn('object_population', ['VisitorLog_ID', 'Object_Code', 'Place_Code', 'Visited_Time'], data);
}

function getVisitor_LogData() {
    return new Promise((resolve, reject) => {
        let queryString = `SELECT Visitor_ID, VisitorLog_ID,VisitorLog_UpdDate,Object_Code,place.Place_Code FROM visitorlog LEFT JOIN place ON visitorlog.Place_MuseumID = place.Place_ID LEFT JOIN object ON object.Object_ID = visitorlog.Object_ID`;
        dbReadCon.query(queryString, (error, results, fields) => {
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
    mysql_tools.writeColumn("visitor_log", ["Visitor_ID", "VisitorLog_ID", "VisitorLog_UpdDate", "Object_Code", "Place_Code"], data);
}

function pullAllObject_Pop() {
    getObject_PopData()
        .then(result => {
            writeObject_Pop(result);
        })
}

function pullAllVisitor_Log() {
    getVisitor_LogData().then((result) => {
        writeVisitor_Log(result);
    });
}


var allexports = {};
allexports.getObject_PopData = getObject_PopData;
allexports.writeObject_PopData = writeObject_Pop;
allexports.pullAllObject_Pop = pullAllObject_Pop;
allexports.getVisitor_LogData = getVisitor_LogData;
allexports.writeVisitor_Log = writeVisitor_Log;
allexports.pullAllVisitor_Log = pullAllVisitor_Log;

module.exports = allexports;
