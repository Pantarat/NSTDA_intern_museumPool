const dbCon = require('../config/db').dbupdCon;
const tool = require('./writeTo_newDatabase')
module.exports ={
    insert_one_model : function(req) {
        var info = Object.assign({},req.body)

        let ID = Object.values(info)[0];
        let Date = Object.values(info)[1];
            
        dbCon.query(`INSERT INTO visitor_log (Visitor_ID,VisitorLog_UpdDate) VALUES (?,?)`,[ID,Date], (error,results,fields) => {
            if (error) throw error;
        })
        
    },
    insert_update_model : function() {
        console.log('done');
        tool.pullAllVisitor_Log;
        console.log('done2');
    }
}