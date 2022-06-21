const dbCon = require('../config/db').dbupdCon;
const { time } = require('console');
const tool = require('./writeTo_newDatabase')
module.exports ={
    insert_one_model : function(req) {
        var info = Object.assign({},req.body)

        let ID = Object.values(info)[0];
        let ObjCode = Object.values(info)[1];
        let PlaceCode = Object.values(info)[2];
        let DbCode = Object.values(info)[3];
            
        dbCon.query(`INSERT INTO visitor_log (Visitor_ID,Object_Code,Place_Code,Database_ID) VALUES (?,?,?,?)`,[ID,ObjCode,PlaceCode,DbCode], (error,results,fields) => {
            if (error) throw error;
        })
        
    },
    insert_update_model : function() {
        tool.pullAllVisitor_Log();
    },
    insert_one_model1 : function(req) {
        var info = Object.assign({},req.body)

        let ID = Object.values(info)[0];
        let Visitlog = Object.values(info)[1];
        let ObjCode = Object.values(info)[2];
        let PlaceCode = Object.values(info)[3];
        let Time = Object.values(info)[4];
            
        dbCon.query(`INSERT INTO object_population (id,VisitorLog_ID,Object_Code,Place_Code,Visited_Time) VALUES (?,?,?,?,?)`,[ID,Visitlog,ObjCode,PlaceCode,Time], (error,results,fields) => {
            if (error) throw error;
        })
        
    },
    insert_update_model1 : function() {
        tool.pullAllObject_Pop();
    }
}