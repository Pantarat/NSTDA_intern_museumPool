
write = require('./models/writeTo_newDatabase');
test = require('./models/popular_model');
dbtest = require('./config/db');
tool = require('./models/mysql_tools');
keyword = require('./models/keyword')
topkey = require('./models/topKeyword');
similarity = require('./models/similarity');
recommend = require('./models/recommend');

require('dotenv').config();

//write.pullAllObject_Image(process.env.ORIGINALDB1);

//keyword.fillRelation(0);

//keyword.fillRelation(3773);

//topkey.getRecommedImage(8166,90);

// similarity.findSimilarity(1,3).then(result=>{
//     console.log(result);
// })

//similarity.writeSimilarityForID(1);

//console.log(similarity.findUnion(new Set([1,2,3]), new Set([2,3,4])));

//similarity.writeAllSimilarity();

//similarity.writeAllSimilarity2(1);

// similarity.getRecommedImage(3,10);

//topkey.getRecommedImage(3,10);

recommend.getRecommended(3,'SIMILAR',200,500);