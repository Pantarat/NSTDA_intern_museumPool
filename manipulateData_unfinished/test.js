const read = require('./getData');
const write = require('./writeData')
const mysql = require('mysql');

read.makeConnection('localhost', 'root', 'charay1968', 'Museum_data');
write.makeConnection('localhost', 'root', 'charay1968', 'Museum_data_2');

// readCon = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'charay1968',
//     database: 'Museum_data'
// })
// writeCon = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'charay1968',
//     database: 'Museum_data_2'
// })

//read.logAllData('comment');

//read.logDataByColumn('object',['Object_Code','Place_Code']);

read.getColumnArrayOfData('object',['Object_Code','Place_Code'])
.then(data => {
    write.writeColumn('object_population',['Object_Code','Place_Code'],data)})





