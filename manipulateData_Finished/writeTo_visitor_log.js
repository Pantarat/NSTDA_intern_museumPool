const read = require('./getData');
const write = require('./writeData');
const mysql = require('mysql');
var connectionProp = {};

//Need to change connection properties here
readConProp = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Museum_Data'
}
writeConProp = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Museum_Data_2'
}

var dbreadCon = mysql.createConnection(readConProp);
var dbwriteCon = mysql.createConnection(writeConProp);


function makeReadConnection([host, user, password, database]){
    connectionProp.host = host;
    connectionProp.user = user;
    connectionProp.password = password;
    connectionProp.database = database;
    dbreadCon = mysql.createConnection(connectionProp);
    dbreadCon.connect();
}
function makeWriteConnection([host, user, password, database]){
    connectionProp.host = host;
    connectionProp.user = user;
    connectionProp.password = password;
    connectionProp.database = database;
    dbwriteCon = mysql.createConnection(connectionProp);
    dbwriteCon.connect();
}

function getVisitor_LogData() {
    return new Promise((resolve, reject) => {
        let queryString = `SELECT Visitor_ID,VisitorLog_UpdDate,place.Place_Code,Object_Code FROM visitorlog LEFT JOIN place ON visitorlog.Place_MuseumID = place.Place_ID LEFT JOIN object ON object.Object_ID = visitorlog.Object_ID`;
        dbreadCon.query(queryString, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(JSON.stringify(results)));
            }
        })
    })
}

function writeVisitor_Log(data) {
    dbwriteCon.query('ALTER TABLE object_population MODIFY id INT AUTO_INCREMENT')
    write.makeConnection(Object.values(writeConProp));
    write.writeColumn('visitor_log',['Visitor_ID','VisitorLog_UpdDate','Object_Code','Place_Code'],data);
}

function pullAllVisitor_Log() {
    getVisitor_LogData()
    .then(result => {
        writeVisitor_Log(result);
    })
}

pullAllVisitor_Log();

var allexports = {};
allexports.dbreadCon = dbreadCon;
allexports.dbwriteCon =dbwriteCon;
allexports.makeReadConnection = makeReadConnection;
allexports.makeWriteConnection = makeWriteConnection;
allexports.getVisitor_LogData = getVisitor_LogData;
allexports.writeVisitor_Log = writeVisitor_Log;
allexports.pullAllVisitor_Log = pullAllVisitor_Log 

module.exports = allexports;
