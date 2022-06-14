const read = require('./getData');
const write = require('./writeData');
const mysql = require('mysql');
var connectionProp = {};

//Need to change connection properties here
readConProp = {
    host: 'localhost',
    user: 'root',
    password: 'charay1968',
    database: 'Museum_Data'
}
writeConProp = {
    host: 'localhost',
    user: 'root',
    password: 'charay1968',
    database: 'Museum_Data_2'
}

var dbreadCon = mysql.createConnection(readConProp);
var dbwriteCon = mysql.createConnection(writeConProp);


function makeReadConnection(host, user, password, database){
    connectionProp.host = host;
    connectionProp.user = user;
    connectionProp.password = password;
    connectionProp.database = database;
    dbreadCon = mysql.createConnection(connectionProp);
    dbreadCon.connect();
}
function makeWriteConnection(host, user, password, database){
    connectionProp.host = host;
    connectionProp.user = user;
    connectionProp.password = password;
    connectionProp.database = database;
    dbwriteCon = mysql.createConnection(connectionProp);
    dbwriteCon.connect();
}

function getObject_PopData() {
    return new Promise((resolve, reject) => {
        let queryString = `SELECT Object_Code, Place_Code, VisitorLog_UpdDate FROM visitorlog JOIN object ON visitorlog.Object_ID = object.Object_ID`;
        dbreadCon.query(queryString, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(JSON.stringify(results)));
            }
        })
    })
}

function writeObject_Pop(data) {
    dbwriteCon.query('ALTER TABLE object_population MODIFY id INT AUTO_INCREMENT')
    write.makeConnection(Object.values(writeConProp));
    write.writeColumn('object_population',['Object_Code','Place_Code','Visited_Time'],data);
}

function pullAllObject_Pop() {
    getObject_PopData()
    .then(result => {
        writeObject_Pop(result);
    })
}

pullAllObject_Pop();

var allexports = {};
allexports.dbreadCon = dbreadCon;
allexports.dbwriteCon =dbwriteCon;
allexports.makeReadConnection = makeReadConnection;
allexports.makeWriteConnection = makeWriteConnection;
allexports.getObject_PopData = getObject_PopData;
allexports.writeObject_PopData = writeObject_Pop;
allexports.pullAllObject_Pop = pullAllObject_Pop;

module.exports = allexports;
