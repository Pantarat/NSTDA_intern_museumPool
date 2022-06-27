write = require('./models/writeTo_newDatabase');
test = require('./models/popular_model');
dbtest = require('./config/db');
tool = require('./models/mysql_tools');
keyword = require('./models/keyword')

write.pullAllObject_Pop(process.env.ORIGINALDB1);
require('dotenv').config();
//write.pullAllVisitor_Log('museum_pool');
//write.pullAllObject('museum_pool');
//console.log(test.process_popular());
//test.process_popular();


//tool.logAllData(process.env.ORIGINALDB2,'Test1');

// tool.readColumnArrayOfUpdatedData('object',['id','description'],'',5).then(result=>{
//     console.log(result);
// })

// let k = 1985;
// for (let i = k; i < 7700; i += 5) {
//     setTimeout(() => {
//         j = i + 5;
//         console.log('Written',i,'to',j);
//         keyword.fillRelation(i, j);
//     }, (i-k) * 500)
// }



//keyword.fillKeywordAndRelation(60,65)