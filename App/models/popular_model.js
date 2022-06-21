const mysql_tools = require('./mysql_tools');
const mysql = require('mysql');
const dfd = require('danfojs-node');
const {dbogCon: dbogCon, dbupdCon: dbupdCon} = require('../config/db');
const allexports = require('./writeTo_newDatabase');

async function process_popular(){

    //read data from table
    var pop_data = await mysql_tools.readColumnArrayOfUpdatedData('visitor_log',['Visitor_ID','VisitorLog_UpdDate','Object_Code','Place_Code']);

    //remove duplicates
    pop_data = pop_data.filter((tag, index, array) => array.findIndex(t => t.Visitor_ID == tag.Visitor_ID && t.Object_Code == tag.Object_Code) == index);

    //change types of data
    let column_toStr = ['Visitor_ID','Object_Code','Place_Code'];
    pop_data.forEach((row) => {
        for(let column of column_toStr){
            row[column] = row[column].toString();
        }
        row['VisitorLog_UpdDate'] = Date.parse(row['VisitorLog_UpdDate']);
        }
    )
    console.log(pop_data)


}

let allfuncs = {};
allfuncs.process_popular = process_popular;
module.exports = allfuncs;