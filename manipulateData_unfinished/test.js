const read = require('./getData');
const write = require('./writeData')

read.makeConnection('localhost', 'root', 'charay1968', 'Museum_data');

//read.logAllData('comment');

//read.logDataByColumn('comment',['Comment_ID','Comment_Description']);



