write = require('./models/writeTo_newDatabase');
test = require('./models/popular_model');
dbtest = require('./config/db');
tool = require('./models/mysql_tools');
keyword = require('./models/keyword')
topkey = require('./models/topKeyword');
similarity = require('./models/similarity');

require('dotenv').config();


//keyword.fillRelation(0);

//keyword.fillRelation(3773);

//topkey.getRecommedImage(8166,90);

similarity.findSimilarity(27715,20304).then(result=>{
    console.log(result);
})

//console.log(similarity.findUnion(new Set([1,2,3]), new Set([2,3,4])));