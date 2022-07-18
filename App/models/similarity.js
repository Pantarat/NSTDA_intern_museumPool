const sql_tool = require('./mysql_tools');
const dbconfig = require('../config/db');
const dbogCon = dbconfig.dbogCon;
const dbupdCon = dbconfig.dbupdCon;
require('dotenv').config();

let visitorIDs;

async function getVisitedObjectCodes(visitorID) {
    return new Promise((resolve, reject) => {
        queryString = `SELECT Object_Code
        FROM ${process.env.UPDATEDDB}.visitor_log
        WHERE Visitor_ID = ${visitorID}
        GROUP BY Object_Code`
        dbupdCon.query(queryString, (error, result) => {
            if (error) throw error;
            if (result.length == 0) {
                reject(`Error! No visiotrID = ${visitorID} in system`);
            }
            else {
                resolve(new Set(result.map(object_code => {
                    return JSON.parse(JSON.stringify(object_code))['Object_Code']
                }
                )));
            }
        })
    })
}

function getAllVisitorID() {
    return new Promise((resolve, reject) => {
        queryString = `SELECT Visitor_ID
        FROM ${process.env.UPDATEDDB}.visitor_log
        GROUP BY Visitor_ID
        ORDER BY Visitor_ID ASC;`
        dbupdCon.query(queryString, (error, result) => {
            if (error) throw error;
            else {
                resolve(JSON.parse(JSON.stringify(result)));
            }
        })
    })
}

function findIntersect(A, B) {
    return new Set(
        [...A].filter(x => B.has(x)));
}

function findUnion(A, B) {
    return new Set([...A, ...B]);
}

async function findSimilarity(data1, data2) {
    return new Promise((resolve, reject) => {
        let same = findIntersect(data1, data2).size;
        let total = findUnion(data1, data2).size;
        resolve(same / total);
    })
}

async function findSimilarityByID(id1, id2) {
    let data1;
    let data2;
    try {
        data1 = await getVisitedObjectCodes(id1);
        data2 = await getVisitedObjectCodes(id2);
        let same = findIntersect(data1, data2).size;
        let total = findUnion(data1, data2).size;
        return new Promise((resolve, reject) => {
            resolve(same / total);
        })
    }
    catch (error) {
        reject(error);
    }
}

async function writeSimilarityForID(id) {
    if (!visitorIDs) {
        visitorIDs = await getAllVisitorID();
    }
    console.time(`Write Similarity Time for id:${id}`);
    let data1;
    let data2;
    let relationJSON = {};
    try {
        data1 = await getVisitedObjectCodes(id);
        for (let i = 0; i < visitorIDs.length; i++) {
            let otherid = visitorIDs[i].Visitor_ID;
            data2 = await getVisitedObjectCodes(otherid);
            if (id != otherid) {
                relationJSON[otherid] = await findSimilarity(data1, data2);
            }
            //console.log('Got relation upto ',otherid);
        }
    }
    catch (error) {
        return error
    }
    let queryString = `INSERT INTO visitor_similarity (visitor_id,similarity)
            VALUES (?,?)
            ON DUPLICATE KEY
            UPDATE similarity = VALUES(similarity);`
    dbupdCon.query(queryString, [id, JSON.stringify(relationJSON)], (error, result) => {
        if (error) throw error;
        else {
            console.log('Written similarity completed for id = ', id);
            console.timeEnd(`Write Similarity Time for id:${id}`);
        }
    })
}

async function writeAllSimilarity(startfrom = 0) {

    console.time(`Time to write sim. from id:${startfrom}`);
    if (!visitorIDs) {
        visitorIDs = await getAllVisitorID();
    }

    let allvisitorid = visitorIDs.map((x) => { return x.Visitor_ID; })
    let startfromind = 0;
    //turn the startfrom id into index.
    if (startfrom > 0) {
        if (!allvisitorid.includes(startfrom)) {
            console.log('Could not find visitor id :', startfrom);
            return 0;
        }
        else {
            startfromind = allvisitorid.indexOf(startfrom);
        }
    }

    for (let i = startfromind; i < visitorIDs.length; i++) {
        await writeSimilarityForID(visitorIDs[i].Visitor_ID);
    }
    console.log('Written Completed!');
    console.timeEnd(`Time to write sim. from id:${startfrom}`);
    return 0;
}

//Slower version, tested by pulling all data first
async function writeAllSimilarity2(startfrom = 0) {
    console.time(`Time to get all data`);
    let alldata = await sql_tool.getColumnArrayOfData(process.env.UPDATEDDB, `visitor_log`, ['Visitor_ID', 'Object_Code']);
    let allVisitorID = Array.from(new Set(alldata.map((x) => { return x.Visitor_ID })));
    let startfromind = 0;
    //turn the startfrom id into index.
    if (startfrom > 0) {
        if (!allVisitorID.includes(startfrom)) {
            console.log('Could not find visitor id :', startfrom);
            return 0;
        }
        else {
            startfromind = allVisitorID.indexOf(startfrom);
        }
    }
    console.timeEnd(`Time to get all data`);
    //the for loop
    let queryString = `INSERT INTO visitor_similarity (visitor_id,similarity)
    VALUES (?,?)
    ON DUPLICATE KEY
    UPDATE similarity = VALUES(similarity);`

    for (let i = startfromind; i < allVisitorID.length; i++) {
        let relationJSON = {};
        let id = allVisitorID[i];
        console.time(`write Similarity Time for id:${id}`); // Timed the process
        let data1 = new Set(alldata.filter(log => log.Visitor_ID === id).map((x) => { return x.Object_Code }));
        for (let j = 0; j < allVisitorID.length; j++) {
            let otherid = allVisitorID[j];
            let data2 = new Set(alldata.filter(log => log.Visitor_ID === otherid).map((x) => { return x.Object_Code }));
            if (id != otherid) {
                relationJSON[otherid] = await findSimilarity(data1, data2);
            }
            //console.log('Got relation upto ',otherid);
        }

        await sql_tool.writeColumn('visitor_similarity', ['visitor_id', 'similarity'], [id, JSON.stringify(relationJSON)]);
        console.log('Written similarity completed for id = ', id);
        console.timeEnd(`write Similarity Time for id:${id}`);
    }
}

similarityexports = {}
similarityexports.getVisitedObjectCodes = getVisitedObjectCodes;
similarityexports.findIntersect = findIntersect;
similarityexports.findUnion = findUnion;
similarityexports.findSimilarity = findSimilarity;
similarityexports.writeSimilarityForID = writeSimilarityForID;
similarityexports.writeAllSimilarity = writeAllSimilarity;
similarityexports.findSimilarityByID = findSimilarityByID;
similarityexports.writeAllSimilarity2 = writeAllSimilarity2;

module.exports = similarityexports;