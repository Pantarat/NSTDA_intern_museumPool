const adapter = require('./adapter_tools/writeTo_newDatabase');
//environment
require('dotenv').config({path: './database_props.env'});
let host = process.env.HOST;
let user = process.env.USER;
let password = process.env.PASSWORD;
let readdatabase = process.env.READDATABASE;
let writedatabase = process.env.WRITEDATABASE;

//Need to change connection properties here
adapter.makeReadConnection([host, user, password, readdatabase]);
adapter.makeWriteConnection([host, user, password, writedatabase]);

adapter.pullAllObject_Pop();

adapter.pullAllVisitor_Log();





