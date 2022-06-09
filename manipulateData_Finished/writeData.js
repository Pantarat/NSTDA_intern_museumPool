const mysql = require('mysql');

var connectionProp = {}
connectionProp.host = '';
connectionProp.user = '';
connectionProp.password = '';
connectionProp.database = '';
var dbCon;

//parameter is array for easy code use
function makeConnection([host, user, password, database]){
    connectionProp.host = host;
    connectionProp.user = user;
    connectionProp.password = password;
    connectionProp.database = database;
    dbCon = mysql.createConnection(connectionProp);
    dbCon.connect();
}

function endConnection(){
    dbCon.end();
}


function writeColumn(table,columns,data){
    dataStr = data.map(row=> Object.values(row));
    queryString = `INSERT INTO ${connectionProp.database}.${table} (${columns}) VALUES ?`;
    dbCon.query(queryString,[dataStr], (error,results,fields) => {
        if(error) throw error;
        else{
            console.log('Data written succesfully');
        }
    });
}

let writeData = {};
writeData.makeConnection = makeConnection;
writeData.writeColumn = writeColumn;
writeData.endConnection = endConnection;

module.exports = writeData;