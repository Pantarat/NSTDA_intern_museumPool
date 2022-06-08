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

//?

let writeData = {};
writeData.makeConnection = makeConnection;

module.exports = writeData;