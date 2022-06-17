const adapter = require('./adapter_tools/writeTo_newDatabase');
//Need to change connection properties in environment
//create new '.env' in this directory if not already have and paste     
    // HOST            = 
    // DBUSER          = 
    // PASSWORD        = 
    // READDATABASE    = 
    // WRITEDATABASE   =
//and config

adapter.pullAllObject_Pop();
adapter.pullAllVisitor_Log();





