const sql_tool = require('./mysql_tools');
const dbconfig = require('../config/db');
const dbogCon = dbconfig.dbogCon;
const dbupdCon = dbconfig.dbupdCon;
require('dotenv').config();

async function getVisitedObjectCodes(visitorID) {
    return new Promise((resolve, reject) => {
        queryString = `SELECT Object_Code
        FROM ${process.env.UPDATEDDB}.visitor_log
        WHERE Visitor_ID = ${visitorID}
        GROUP BY Object_Code`
        dbupdCon.query(queryString, (error, result) => {
            if (error) throw error;
            if (result.length == 0){
                reject(`Error! No visiotrID = ${visitorID} in system`);
            }
            else{
                resolve(new Set(result.map(object_code=>{
                    return JSON.parse(JSON.stringify(object_code))['Object_Code']}
                    )));  
            }
        })
    })
}

function findIntersect(A,B){
    return new Set(
        [...A].filter(x => B.has(x)));
}

function findUnion(A,B){
    return new Set([...A, ...B]);
}

async function findSimilarity(id1,id2){
    let data1;
    let data2;
    try{
        data1 = await getVisitedObjectCodes(id1);
        data2 = await getVisitedObjectCodes(id2);
    }
    catch(error){
        console.log(error);
    }
    return new Promise((resolve,reject)=>{
        try{
            let same = findIntersect(data1,data2).size;
            let total = findUnion(data1,data2).size;
            resolve(same/total);
        }
        catch{}
    })
}

similarityexports = {}
similarityexports.getVisitedObjectCodes = getVisitedObjectCodes;
similarityexports.findIntersect = findIntersect;
similarityexports.findUnion = findUnion;
similarityexports.findSimilarity = findSimilarity;

module.exports = similarityexports;