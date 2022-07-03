write = require('./models/writeTo_newDatabase');
test = require('./models/popular_model');
dbtest = require('./config/db');
tool = require('./models/mysql_tools');
keyword = require('./models/keyword')
topkey = require('./models/topKeyword');


require('dotenv').config();


//keyword.fillRelation(0);

topkey.getRecommedImage(1);