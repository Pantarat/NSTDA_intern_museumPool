write = require('./models/writeTo_newDatabase');
test = require('./models/popular_model');
//write.pullAllVisitor_Log();
//console.log(test.process_popular());
console.log(test.value_count(['a','b','c','a','b','b','b','b']));