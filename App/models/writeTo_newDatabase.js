const dbconfig = require('../config/db')
const dbogCon = dbconfig.dbogCon;
const dbupdCon = dbconfig.dbupdCon;
const mysql_tools = require('./mysql_tools');

function getObject_PopData(database) {
    return new Promise((resolve, reject) => {
        let queryString = `SELECT Object_Code, Place_Code, VisitorLog_UpdDate FROM ${database}.visitorlog JOIN ${database}.object ON visitorlog.Object_ID = object.Object_ID`;
        dbogCon.query(queryString, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(JSON.stringify(results)));
            }
        })
    })
}

function writeObject_Pop(data) {
    //setup properties of table
    //dbwriteCon.query('ALTER TABLE object_population DROP PRIMARY KEY, MODIFY id INT AUTO_INCREMENT UNIQUE, ADD COLUMN VisitorLog_ID INT PRIMARY KEY NOT NULL')

    mysql_tools.writeColumn('object_population', ['Object_Code', 'Place_Code', 'Visited_Time'], data, ['Object_Code', 'Place_Code', 'Visited_Time']);
}

function getVisitor_LogData(database) {
    return new Promise((resolve, reject) => {

        let queryString = `SELECT Visitor_ID, VisitorLog_UpdDate,Object_Code,place.Place_Code FROM ${database}.visitorlog LEFT JOIN ${database}.place ON visitorlog.Place_MuseumID = place.Place_ID LEFT JOIN ${database}.object ON object.Object_ID = visitorlog.Object_ID`;
        dbogCon.query(queryString, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(JSON.stringify(results)));
            }
        });
    });
}

function writeVisitor_Log(data) {
    //Check for dups mysql_tools.writeColumn("visitor_log", ["Visitor_ID", "VisitorLog_UpdDate", "Object_Code", "Place_Code"], [{'Visitor_ID':'11', 'VisitorLog_UpdDate':'2020-02-18 02:14:04', 'Object_Code':'00110028000003', 'Place_Code':'00110028'}], ["Visitor_ID","VisitorLog_UpdDate","Object_Code"]);
    mysql_tools.writeColumn("visitor_log", ["Visitor_ID", "VisitorLog_UpdDate", "Object_Code", "Place_Code"], data, ["Visitor_ID", "VisitorLog_UpdDate", "Object_Code"]);
}

function getObject_ImageData(database) {

    return new Promise((resolve, reject) => {
        let queryString = `
        SELECT 
            object.Object_Code, 
            object.Object_ID, 
            objectdescription.ObjectDescription_Name,
            objectdescription.ObjectDescription,
            re_object_imageobject.ImageObject_ID,
            imageobject.ImageObject_Path
        FROM
            ${database}.object
        JOIN
            ${database}.objectdescription ON object.Object_ID = objectdescription.Object_ID
        JOIN
            ${database}.re_object_imageobject ON object.Object_ID = re_object_imageobject.Object_ID
        JOIN
            ${database}.imageobject ON re_object_imageobject.ImageObject_ID = imageobject.ImageObject_ID`;
        dbogCon.query(queryString, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(JSON.stringify(results)));
            }
        });
    })
}

function writeObject_Image(data) {
    mysql_tools.writeColumn("object_image", ["Object_Code", "Object_ID", "ObjectDescription_Name", "ObjectDescription", "ImageObject_ID", "ImageObject_Path"], data);
}

function getObject_Data(database) {
    return new Promise((resolve, reject) => {
        let queryString =`SELECT
            od.ObjectDescription_Name,
            od.ObjectDescription,
            od.ObjectDescription_Language,
            o.Place_Code,
            o.Object_Code,
            io.ImageObject_Path
        FROM ${database}.object o
        JOIN 
            ${database}.objectdescription od ON o.Object_ID = od.Object_ID
        JOIN
            ${database}.re_object_imageobject ro ON o.Object_ID = ro.Object_ID
        JOIN
            ${database}.imageobject io ON ro.ImageObject_ID = io.ImageObject_ID`
        
        ;
        dbogCon.query(queryString, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(JSON.stringify(results)));
            }
        })
    })
}

function writeObject(data) {
    mysql_tools.writeColumn("object", ["name", "description", "language", "place_code", "object_code", "image"], data);
}

function pullAllObject_Pop(database) {
    getObject_PopData(database)
        .then(result => {
            writeObject_Pop(result);
        })
}

function pullAllVisitor_Log(database) {
    getVisitor_LogData(database).then((result) => {
        writeVisitor_Log(result);
    });
}

function pullAllObject_Image(database) {
    getObject_ImageData(database)
        .then(result => {
            writeObject_Image(result);
        })
}

function pullAllObject(database){
    getObject_Data(database)
    .then(result => {
        writeObject(result);
    })
}


var allexports = {};
allexports.getObject_PopData = getObject_PopData;
allexports.writeObject_PopData = writeObject_Pop;
allexports.pullAllObject_Pop = pullAllObject_Pop;
allexports.getVisitor_LogData = getVisitor_LogData;
allexports.writeVisitor_Log = writeVisitor_Log;
allexports.pullAllVisitor_Log = pullAllVisitor_Log;
allexports.getObject_ImageData = getObject_ImageData;
allexports.writeObject_Image = writeObject_Image;
allexports.pullAllObject_Image = pullAllObject_Image;
allexports.getObject_Data = getObject_Data;
allexports.writeObject = writeObject;
allexports.pullAllObject = pullAllObject


module.exports = allexports;
