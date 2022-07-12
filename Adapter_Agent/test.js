const adapter = require('./adapter_tools/writeTo_newDatabase');
//Need to change connection properties in environment '.env' file
//template for .env file
// HOST            =
// DBUSER          =
// PASSWORD        = 
// READDATABASE    = 
// WRITEDATABASE   = 

adapter.pullAllObject_Pop();
adapter.pullAllVisitor_Log();





