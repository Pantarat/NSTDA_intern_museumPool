write = require('./models/writeTo_newDatabase');
test = require('./models/popular_model');
dbtest = require('./config/db');
tool = require('./models/mysql_tools');
keyword = require('./models/keyword')

//write.pullAllObject_Pop(process.env.ORIGINALDB1);
require('dotenv').config();
//write.pullAllVisitor_Log('museum_pool');
//write.pullAllObject('museum_pool');
//console.log(test.process_popular());
//test.process_popular();


//tool.logAllData(process.env.ORIGINALDB2,'Test1');

// tool.readColumnArrayOfUpdatedData('object',['id','description'],'',5).then(result=>{
//     console.log(result);
// })

keyword.getDescription()
.then(data => {
    keyword.transformDescriptionToKeyword(data).then(result => {
        keyword.writeToKeyword_Table(result);
    })
})