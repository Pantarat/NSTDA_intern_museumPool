require('dotenv').config();
const mysql = require('mysql');

//Use DBUSER instead of USER b/c USER already exists in default environment
const dbogCon = mysql.createPool({
    host: process.env.HOST,
    user: process.env.DBUSER,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    database: process.env.ORIGINALDB1
})

const dbupdCon = mysql.createPool({
    host: process.env.HOST,
    user: process.env.DBUSER,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    database: process.env.UPDATEDDB
})

dbogCon.on('connection', function (connection) {
    console.log('DBog Connection established');

    dbogCon.on('error', function (err) {
        console.error(new Date(), 'MySQL error', err.code);
    });
    dbogCon.on('close', function (err) {
        console.error(new Date(), 'MySQL close', err);
    });

});

dbupdCon.on('connection', function (connection) {
    console.log('DBupd Connection established');

    dbupdCon.on('error', function (err) {
        console.error(new Date(), 'MySQL error', err.code);
    });
    dbupdCon.on('close', function (err) {
        console.error(new Date(), 'MySQL close', err);
    });

});

dbexports = {}
dbexports.dbogCon = dbogCon;
dbexports.dbupdCon = dbupdCon;

module.exports = dbexports;