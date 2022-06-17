require('dotenv').config();
const mysql = require('mysql');

//Use DBUSER instead of USER b/c USER already exists in default environment
const dbReadCon = mysql.createPool({
    host: process.env.HOST,
    user: process.env.DBUSER,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    database: process.env.READDATABASE
})

const dbWriteCon = mysql.createPool({
    host: process.env.HOST,
    user: process.env.DBUSER,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    database: process.env.WRITEDATABASE
})

dbReadCon.on('connection', function (connection) {
    console.log('DB Connection established');

    dbReadCon.on('error', function (err) {
        console.error(new Date(), 'MySQL error', err.code);
    });
    dbReadCon.on('close', function (err) {
        console.error(new Date(), 'MySQL close', err);
    });

});

dbWriteCon.on('connection', function (connection) {
    console.log('DB Connection established');

    dbWriteCon.on('error', function (err) {
        console.error(new Date(), 'MySQL error', err.code);
    });
    dbWriteCon.on('close', function (err) {
        console.error(new Date(), 'MySQL close', err);
    });

});

module.exports = {
    dbReadCon: dbReadCon,
    dbWriteCon: dbWriteCon
}