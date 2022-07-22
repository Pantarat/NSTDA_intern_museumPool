const sql_tool = require('./mysql_tools');
const dbconfig = require('../config/db');
const dbogCon = dbconfig.dbogCon;
const dbupdCon = dbconfig.dbupdCon;
require('dotenv').config();

let visitorIDs;

async function getVisitedObjectCodes(visitorID) {
    if (!visitorIDs) {
        visitorIDs = await getAllVisitorID();
    }
    return new Promise((resolve, reject) => {
        if (!(visitorIDs.includes(visitorID))) {
            reject(`Error! No visitorID = ${visitorID} in system`);
        }
        queryString = `SELECT Object_Code
        FROM ${process.env.UPDATEDDB}.visitor_log
        WHERE Visitor_ID = ${visitorID}
        AND
        VisitorLog_UpdDate
		BETWEEN DATE(NOW() - INTERVAL 6 MONTH)
		AND DATE(NOW())
        GROUP BY Object_Code`
        dbupdCon.query(queryString, (error, result) => {
            if (error) throw error;
            if (!result) { result = [] }
            resolve(new Set(result.map(object_code => {
                return JSON.parse(JSON.stringify(object_code))['Object_Code']
            }
            )));
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
                resolve(JSON.parse(JSON.stringify(result)).map((x) => { return x.Visitor_ID }));
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
        resolve(parseFloat((same / total).toFixed(4)));
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
            resolve(parseFloat((same / total).toFixed(4)));
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
    console.time(`Write Similarity Time for id=${id}`);
    let data1;
    let data2;
    let relationArr = [];
    try {
        data1 = await getVisitedObjectCodes(id);
        if (data1.size == 0) { return 'No Log within 6 months' }
        else {
            for (let i = 0; i < visitorIDs.length; i++) {
                let otherid = visitorIDs[i];
                data2 = await getVisitedObjectCodes(otherid);
                if (id != otherid) {
                    relationArr.push([otherid, await findSimilarity(data1, data2)]);
                }
            }
            relationArr = relationArr.sort((a, b) => {
                return b[1] - a[1];
            }).slice(0, 10);
            let relationJSON = {};
            relationArr.forEach(x => {
                relationJSON[x[0]] = x[1];
            })
            let queryString = `INSERT INTO visitor_similarity (visitor_id,similarity)
            VALUES (?,?)
            ON DUPLICATE KEY
            UPDATE similarity = VALUES(similarity);`
            dbupdCon.query(queryString, [id, JSON.stringify(relationJSON)], (error, result) => {
                if (error) throw error;
                else {
                    console.log('Written similarity completed for id = ', id);
                    console.timeEnd(`Write Similarity Time for id=${id}`);
                }
            })
        }

    }
    catch (error) {
        throw error
    }

}

async function writeAllSimilarity(startfrom = 0) {

    console.time(`Time to write sim. from id=${startfrom}`);
    if (!visitorIDs) {
        visitorIDs = await getAllVisitorID();
    }

    let startfromind = 0;
    //turn the startfrom id into index.
    if (startfrom > 0) {
        if (!visitorIDs.includes(startfrom)) {
            console.log('Could not find visitor id :', startfrom);
            return 0;
        }
        else {
            startfromind = visitorIDs.indexOf(startfrom);
        }
    }
    for (let i = startfromind; i < visitorIDs.length; i++) {
        await writeSimilarityForID(visitorIDs[i]);
    }
    console.log('Written Completed!');
    console.timeEnd(`Time to write sim. from id=${startfrom}`);
    return 0;
}

async function getSimilarObject_Code(visitor_id,limit = 20) {
    if (!visitorIDs) {
        visitorIDs = await getAllVisitorID();
    }
    if (!visitorIDs.includes(visitor_id)){
        console.log('Could not find visitor id :', startfrom);
        return 0;
    }
    let sim_data = await sql_tool.getAllData(process.env.UPDATEDDB,'visitor_similarity',`visitor_id = ${visitor_id}`);
    let similarVisitors = Object.keys(JSON.parse(sim_data[0].similarity));
    let allSimilarObjects = [];
    for (let i=0; i<similarVisitors.length; i++){
        allSimilarObjects = allSimilarObjects.concat(Array.from(await getVisitedObjectCodes(parseInt(similarVisitors[i]))));
    }
    let simObjectSorted = {};
    allSimilarObjects.forEach(object => {
        if (Object.keys(simObjectSorted).includes(object)){
            simObjectSorted[object] += 1;
        }
        else{
            simObjectSorted[object] = 1;
        }
    })
    let mostCommonObject = Object.entries(simObjectSorted).sort((x, y) => y[1] - x[1]).slice(0,limit);
    return mostCommonObject;
}

async function getRecommedImage(visitor_id, limit = 20) {
    let mostCommonObject = await getSimilarObject_Code(visitor_id,limit);
    return new Promise((resolve,reject)=>{
        let mostCommonObjectArr = mostCommonObject.map(x=>{ return x[0]});
        sql_tool.getColumnArrayOfData(process.env.UPDATEDDB,'object_image',['Object_ID','ImageObject_Path'],`Object_Code IN (${mostCommonObjectArr})`)
        .then(recommend =>{
            console.log(recommend);
            resolve(recommend);
        })
        .catch(err => {
            reject(err);
        })
    })
}

//Slower version, tested by pulling all data first
// async function writeAllSimilarity2(startfrom = 0) {
//     console.time(`Time to get all data`);
//     let alldata = await sql_tool.getColumnArrayOfData(process.env.UPDATEDDB, `visitor_log`, ['Visitor_ID', 'Object_Code']);
//     let allVisitorID = Array.from(new Set(alldata.map((x) => { return x.Visitor_ID })));
//     let startfromind = 0;
//     //turn the startfrom id into index.
//     if (startfrom > 0) {
//         if (!allVisitorID.includes(startfrom)) {
//             console.log('Could not find visitor id :', startfrom);
//             return 0;
//         }
//         else {
//             startfromind = allVisitorID.indexOf(startfrom);
//         }
//     }
//     console.timeEnd(`Time to get all data`);
//     //the for loop
//     let queryString = `INSERT INTO visitor_similarity (visitor_id,similarity)
//     VALUES (?,?)
//     ON DUPLICATE KEY
//     UPDATE similarity = VALUES(similarity);`

//     for (let i = startfromind; i < allVisitorID.length; i++) {
//         let relationJSON = {};
//         let id = allVisitorID[i];
//         console.time(`write Similarity Time for id:${id}`); // Timed the process
//         let data1 = new Set(alldata.filter(log => log.Visitor_ID === id).map((x) => { return x.Object_Code }));
//         for (let j = 0; j < allVisitorID.length; j++) {
//             let otherid = allVisitorID[j];
//             let data2 = new Set(alldata.filter(log => log.Visitor_ID === otherid).map((x) => { return x.Object_Code }));
//             if (id != otherid) {
//                 relationJSON[otherid] = await findSimilarity(data1, data2);
//             }
//             //console.log('Got relation upto ',otherid);
//         }

//         await sql_tool.writeColumn('visitor_similarity', ['visitor_id', 'similarity'], [id, JSON.stringify(relationJSON)]);
//         console.log('Written similarity completed for id = ', id);
//         console.timeEnd(`write Similarity Time for id:${id}`);
//     }
// }

similarityexports = {}
similarityexports.getVisitedObjectCodes = getVisitedObjectCodes;
similarityexports.findIntersect = findIntersect;
similarityexports.findUnion = findUnion;
similarityexports.findSimilarity = findSimilarity;
similarityexports.writeSimilarityForID = writeSimilarityForID;
similarityexports.writeAllSimilarity = writeAllSimilarity;
similarityexports.findSimilarityByID = findSimilarityByID;
//similarityexports.writeAllSimilarity2 = writeAllSimilarity2;
similarityexports.getSimilarObject_Code = getSimilarObject_Code;
similarityexports.getRecommedImage = getRecommedImage;


module.exports = similarityexports;