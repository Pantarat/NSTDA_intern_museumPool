const read = require('./getData');
const write = require('./writeData')
const mysql = require('mysql');

//Need to change connection properties here
read.makeConnection(['localhost', 'root', '', 'Museum_data']);
write.makeConnection(['localhost', 'root', '', 'Museum_data_2']);

read.logAllData('comment');

read.logDataByColumn('object',['Object_Code','Place_Code']);

read.getColumnArrayOfData('object',['Object_Code','Place_Code'])
.then(data => {
    write.writeColumn('object_population',['Object_Code','Place_Code'],data)})

read.getColumnArrayOfData('visitorlog',['Visitor_ID','VisitorLog_UpdDate'])
.then(data => {
    write.writeColumn('visitor_log',['Visitor_ID','VisitorLog_UpdDate'],data)})





