const {dbogCon: dbogCon, dbupdCon: dbupdCon} = require('../config/db')
const mysql_tools = require('./mysql_tools');

function getObject_PopData() {
    return new Promise((resolve, reject) => {
        let queryString = `SELECT VisitorLog_ID, Object_Code, Place_Code, VisitorLog_UpdDate FROM visitorlog JOIN object ON visitorlog.Object_ID = object.Object_ID`;
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

    mysql_tools.writeColumn('object_population', ['VisitorLog_ID', 'Object_Code', 'Place_Code', 'Visited_Time'], data);
}

function getVisitor_LogData() {
    return new Promise((resolve, reject) => {
        let queryString = `SELECT Visitor_ID, VisitorLog_ID,VisitorLog_UpdDate,Object_Code,place.Place_Code FROM visitorlog LEFT JOIN place ON visitorlog.Place_MuseumID = place.Place_ID LEFT JOIN object ON object.Object_ID = visitorlog.Object_ID LIMIT 10`;
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
    //setup properties of table
    //dbwriteCon.query('ALTER TABLE visitor_log DROP PRIMARY KEY, MODIFY id INT AUTO_INCREMENT UNIQUE, ADD COLUMN VisitorLog_ID INT PRIMARY KEY NOT NULL');
    mysql_tools.writeColumn("visitor_log", ["Visitor_ID", "VisitorLog_ID", "VisitorLog_UpdDate", "Object_Code", "Place_Code"], data);
}

function getObject_ImageData(){
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
            object
        JOIN
            objectdescription ON object.Object_ID = objectdescription.Object_ID
        JOIN
            re_object_imageobject ON object.Object_ID = re_object_imageobject.Object_ID
        JOIN
            imageobject ON re_object_imageobject.ImageObject_ID = imageobject.ImageObject_ID`;
        dbogCon.query(queryString, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(JSON.stringify(results)));
            }
        });
    })
}

function writeObject_Image(data){
    mysql_tools.writeColumn("object_image", ["Object_Code", "Object_ID", "ObjectDescription_Name", "ObjectDescription", "ImageObject_ID", "ImageObject_Path"], data);
}

function pullAllObject_Pop() {
    getObject_PopData()
        .then(result => {
            writeObject_Pop(result);
        })
}

function pullAllVisitor_Log() {
    getVisitor_LogData().then((result) => {
        writeVisitor_Log(result);
    });
}

function pullAllObject_Image() {
    getObject_ImageData()
        .then(result => {
            writeObject_Image(result);
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

module.exports = allexports;
