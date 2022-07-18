
write = require('./models/writeTo_newDatabase');
test = require('./models/popular_model');
dbtest = require('./config/db');
tool = require('./models/mysql_tools');
keyword = require('./models/keyword')
topkey = require('./models/topKeyword');
similarity = require('./models/similarity');

require('dotenv').config();

//write.pullAllObject_Pop(process.env.ORIGINALDB1);

//keyword.fillRelation(0);

//keyword.fillRelation(3773);

//topkey.getRecommedImage(8166,90);

// similarity.findSimilarity(1,3).then(result=>{
//     console.log(result);
// })

//similarity.writeSimilarityForID(1);

//console.log(similarity.findUnion(new Set([1,2,3]), new Set([2,3,4])));

similarity.writeAllSimilarity(7539);

//similarity.writeAllSimilarity2(1);