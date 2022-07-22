const dbconfig = require('../config/db');
const dbogCon = dbconfig.dbogCon;
const dbupdCon = dbconfig.dbupdCon;
require('dotenv').config();

async function get_keyword_and_score(Visitor_ID) {
    return new Promise((resolve, reject) => {
        let queryString = `
        SELECT k.value, okr.score
        FROM 
        (SELECT Visitor_ID, Object_Code, max(VisitorLog_UpdDate)
        from ${process.env.UPDATEDDB}.visitor_log
        where Visitor_ID=${Visitor_ID}
        group by Object_Code, Visitor_ID, Place_Code
        order by max(VisitorLog_UpdDate) DESC Limit 10) v
        JOIN ${process.env.UPDATEDDB}.object_description od ON od.object_code = v.Object_Code
        JOIN ${process.env.UPDATEDDB}.object_keyword_relation okr ON od.id = okr.object_id
        JOIN ${process.env.UPDATEDDB}.keyword k ON okr.keyword_id = k.id
        `;
        dbogCon.query(queryString, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(JSON.stringify(results)));
            }
        })
    })
}

/* input of getmax
 let data = [
    { value: 'Honda (มอเตอร์ไซค์)', score: 0.4166666666666667 },
    { value: 'Suzuki (มอเตอร์ไซค์)', score: 0.4166666666666667 },
    { value: 'Triumph (มอเตอร์ไซค์)', score: 0.4166666666666667 },
    { value: 'การตกแต่งรูปภาพ', score: 0.358974358974359 },
    { value: 'ครอบครัว', score: 0.4166666666666667 },
    { value: 'ชัยปุระ (Jaipur)', score: 0.3666666666666667 },
    { value: 'ชีวประวัติบุคคล', score: 0.3703703703703704 },
    { value: 'ทำบุญ', score: 0.611111111111111 },
    { value: 'บันทึกนักเดินทาง', score: 0.6190476190476191 },
    { value: 'บันทึกนักเดินทาง', score: 0.6666666666666666 },
    { value: 'ปฏิบัติธรรม', score: 0.5 },
    { value: 'ปฏิบัติธรรม', score: 0.6410256410256411 },
    { value: 'ประเทศพม่า', score: 0.3703703703703704 },
    { value: 'ประเทศอินเดีย', score: 0.3666666666666667 },
    { value: 'พระครูวินัยธรมั่น ภูริทตฺโต', score: 0.4871794871794872 },
    { value: 'พระไตรปิฎก', score: 0.39999999999999997 },
    { value: 'พิธีกรรมทางศาสนา', score: 0.27777777777777773 },
    { value: 'ภาพถ่ายขั้นสูง', score: 0.358974358974359 },
    { value: 'มหาสติปัฏฐาน 4', score: 0.39999999999999997 },
    { value: 'มอเตอร์ไซค์', score: 0.6666666666666666 },
    { value: 'ร้านอาหาร', score: 0.38095238095238093 },
    { value: 'วัด', score: 0.6666666666666666 },
    { value: 'วัด', score: 0.42857142857142855 },
    { value: 'ศาสนาพุทธ', score: 0.6666666666666666 },
    { value: 'ศาสนาพุทธ', score: 0.5666666666666667 },
    { value: 'ศาสนาพุทธ', score: 0.5555555555555555 },
    { value: 'ศาสนาพุทธ', score: 0.6666666666666666 },
    { value: 'สถานที่ท่องเที่ยวต่างประเทศ', score: 0.2261904761904762 },
    { value: 'สถานที่ท่องเที่ยวต่างประเทศ', score: 0.43333333333333335 },
    { value: 'หน้าต่างโลก', score: 0.3703703703703704 },
    { value: 'อาหาร', score: 0.38095238095238093 },
    { value: 'อาหารคาว', score: 0.38095238095238093 },
    { value: 'เที่ยวต่างประเทศ', score: 0.6666666666666666 },
    { value: 'เที่ยวต่างประเทศ', score: 0.5666666666666667 },
    { value: 'เที่ยวต่างประเทศ', score: 0.3055555555555555 },
    { value: 'เที่ยววัด', score: 0.42857142857142855 },
    { value: 'เรื่องเล่าสยองขวัญ', score: 0.4166666666666667 },
    { value: 'แต่งรถ', score: 0.4166666666666667 },
    { value: 'แผนที่เดินทาง', score: 0.3055555555555555 },
    { value: 'โรงแรมรีสอร์ท', score: 0.3055555555555555 }
];
*/
function getunsortedkeyword(data) {
    if(Object.keys(data).length == 0){
        return { message : "Visitor ID doesn't exist" }
    }
    let unsortedList = {};
    unsortedList[0] = { value: data[0].value, score: data[0].score };
    let count = 1;
    
    for (let j = 1; j < Object.keys(data).length; j++) {
        let set = 0;
        let currentKeyword = data[j].value;
        let currentScore = data[j].score;
        
        for (let i = 0; i < Object.keys(unsortedList).length; i++) {
            if (unsortedList[i].value == currentKeyword) {
                unsortedList[i].score = unsortedList[i].score + currentScore;
                set = 1;
            }
        }
        if (set == 0) {
            unsortedList[count] = { value: currentKeyword, score: currentScore }
            count+=1;
        }

    }
    return unsortedList
}
/*input of sorted array
let unsortedList={
    '0': { value: 'Honda (มอเตอร์ไซค์)', score: 0.4166666666666667 },
    '1': { value: 'Suzuki (มอเตอร์ไซค์)', score: 0.4166666666666667 },
    '2': { value: 'Triumph (มอเตอร์ไซค์)', score: 0.4166666666666667 },
    '3': { value: 'การตกแต่งรูปภาพ', score: 0.358974358974359 },
    '4': { value: 'ครอบครัว', score: 0.4166666666666667 },
    '5': { value: 'ชัยปุระ (Jaipur)', score: 0.3666666666666667 },
    '6': { value: 'ชีวประวัติบุคคล', score: 0.3703703703703704 },
    '7': { value: 'ทำบุญ', score: 0.611111111111111 },
    '8': { value: 'บันทึกนักเดินทาง', score: 1.2857142857142856 },
    '9': { value: 'ปฏิบัติธรรม', score: 1.141025641025641 },
    '10': { value: 'ประเทศพม่า', score: 0.3703703703703704 },
    '11': { value: 'ประเทศอินเดีย', score: 0.3666666666666667 },
    '12': { value: 'พระครูวินัยธรมั่น ภูริทตฺโต', score: 0.4871794871794872 },
    '13': { value: 'พระไตรปิฎก', score: 0.39999999999999997 },
    '14': { value: 'พิธีกรรมทางศาสนา', score: 0.27777777777777773 },
    '15': { value: 'ภาพถ่ายขั้นสูง', score: 0.358974358974359 },
    '16': { value: 'มหาสติปัฏฐาน 4', score: 0.39999999999999997 },
    '17': { value: 'มอเตอร์ไซค์', score: 0.6666666666666666 },
    '18': { value: 'ร้านอาหาร', score: 0.38095238095238093 },
    '19': { value: 'วัด', score: 1.0952380952380951 },
    '20': { value: 'ศาสนาพุทธ', score: 2.4555555555555553 },
    '21': { value: 'สถานที่ท่องเที่ยวต่างประเทศ', score: 0.6595238095238095 },
    '22': { value: 'หน้าต่างโลก', score: 0.3703703703703704 },
    '23': { value: 'อาหาร', score: 0.38095238095238093 },
    '24': { value: 'อาหารคาว', score: 0.38095238095238093 },
    '25': { value: 'เที่ยวต่างประเทศ', score: 1.538888888888889 },
    '26': { value: 'เที่ยววัด', score: 0.42857142857142855 },
    '27': { value: 'เรื่องเล่าสยองขวัญ', score: 0.4166666666666667 },
    '28': { value: 'แต่งรถ', score: 0.4166666666666667 },
    '29': { value: 'แผนที่เดินทาง', score: 0.3055555555555555 },
    '30': { value: 'โรงแรมรีสอร์ท', score: 0.3055555555555555 }
  }
*/
function sortList(unsortedList){
    let sortedList={};
    sortedList[0]=unsortedList[0];
    for(let x = 1; x<Object.keys(unsortedList).length;x++){
        let pass=0;
        for(let y = 0; y<Object.keys(sortedList).length;y++){
            if (sortedList[y].score < unsortedList[x].score) {
                pass=1;
                for(let z =Object.keys(sortedList).length;z>y;z--){
                    sortedList[z]=sortedList[z-1];
                }  
                sortedList[y]=unsortedList[x];
                break
            }
            
        }
        if (pass == 0){
            sortedList[Object.keys(sortedList).length]=unsortedList[x];
        }
    }
    return sortedList
}
function getTopKeyword(sortedList){
    let recommendKeyword = {};
    recommendKeyword[0]=sortedList[0];
    recommendKeyword[1]=sortedList[1];
    recommendKeyword[2]=sortedList[2];
    return recommendKeyword
}

async function getImageFromKeyword(VisitorID,recommendKeyword,limit = 0,distance = 1000) {
    return new Promise((resolve, reject) => {
        let queryString = `
        SELECT okrc.object_id,okrc.count,od.image,(
            -- for the distance
            111.111 *
            DEGREES(ACOS(LEAST(1.0, COS(RADIANS(od.place_latitude))
             * COS(RADIANS(mostrecent.place_latitude))
             * COS(RADIANS(od.place_longtitude - mostrecent.place_longtitude))
             + SIN(RADIANS(od.place_latitude))
             * SIN(RADIANS(mostrecent.place_latitude)))))) AS distance_in_km
             -- for the distance
            FROM(
                SELECT object_id,COUNT(*) AS count
                FROM object_keyword_relation okr
                JOIN keyword k ON okr.keyword_id = k.id
                WHERE k.value IN ('${recommendKeyword[0].value}','${recommendKeyword[1].value}','${recommendKeyword[2].value}') -- values to filter
                GROUP BY okr.object_id
                ORDER BY okr.object_id) AS okrc
            JOIN object_description od ON okrc.object_id = od.id
            JOIN visitor_log v ON od.object_code = v.Object_Code
            JOIN (
                SELECT Object_Code,place_latitude,place_longtitude
                FROM object_description
                WHERE Object_Code =
                    (SELECT Object_Code
                    from visitor_log
                    where Visitor_ID=${VisitorID}
                    group by Object_Code
                    order by max(VisitorLog_UpdDate) DESC Limit 1)) AS mostrecent
            WHERE od.object_code NOT IN(
                SELECT object_code
                FROM visitor_log
                WHERE Visitor_ID = ${VisitorID} -- filter out objects thats already seen
                )
            AND
                (v.VisitorLog_UpdDate
                BETWEEN DATE(NOW() - INTERVAL 6 MONTH)
                AND DATE(NOW()))
            GROUP BY okrc.object_id
            -- for the distance
            HAVING distance_in_km < ${distance}
            -- for the distance
            ORDER BY distance_in_km ASC,okrc.count DESC
        `;
        if (limit>0){
            queryString += 'LIMIT ' + limit;
        }
        dbupdCon.query(queryString, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(JSON.stringify(results)));
            }
        })
    })
}
function ExtraKey(sortedList){
    let ExtraList =[];
    for (let i = 3; i < Object.keys(sortedList).length;i=i+1){
        ExtraList.push(sortedList[i].value);
    }
    let ExtraString = ExtraList.join("','");
    return ExtraString
}
async function getImageFromKeywordExtra(VisitorID,ExtraString,limit = 0,distance = 1000) {
    return new Promise((resolve, reject) => {
        let queryString = `
        SELECT okrc.object_id,okrc.count,od.image,(
            -- for the distance
            111.111 *
            DEGREES(ACOS(LEAST(1.0, COS(RADIANS(od.place_latitude))
             * COS(RADIANS(mostrecent.place_latitude))
             * COS(RADIANS(od.place_longtitude - mostrecent.place_longtitude))
             + SIN(RADIANS(od.place_latitude))
             * SIN(RADIANS(mostrecent.place_latitude)))))) AS distance_in_km
             -- for the distance
            FROM(
                SELECT object_id,COUNT(*) AS count
                FROM object_keyword_relation okr
                JOIN keyword k ON okr.keyword_id = k.id
                WHERE k.value IN ('${ExtraString}') -- values to filter
                GROUP BY okr.object_id
                ORDER BY okr.object_id) AS okrc
            JOIN object_description od ON okrc.object_id = od.id
            JOIN visitor_log v ON od.object_code = v.Object_Code
            JOIN (
                SELECT Object_Code,place_latitude,place_longtitude
                FROM object_description
                WHERE Object_Code =
                    (SELECT Object_Code
                    from visitor_log
                    where Visitor_ID=${VisitorID}
                    group by Object_Code
                    order by max(VisitorLog_UpdDate) DESC Limit 1)) AS mostrecent
            WHERE od.object_code NOT IN(
                SELECT object_code
                FROM visitor_log
                WHERE Visitor_ID = ${VisitorID} -- filter out objects thats already seen
                )
            AND
                (v.VisitorLog_UpdDate
                BETWEEN DATE(NOW() - INTERVAL 6 MONTH)
                AND DATE(NOW()))
            GROUP BY okrc.object_id
            -- for the distance
            HAVING distance_in_km < ${distance}
            -- for the distance
            ORDER BY distance_in_km ASC,okrc.count DESC
        `;
        if (limit>0){
            queryString += 'LIMIT ' + limit;
        }
        dbupdCon.query(queryString, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(JSON.stringify(results)));
            }
        })
    })
}

async function getRecommedImage(Visitor_ID,limit,distance){
    get_keyword_and_score(Visitor_ID)
    .then(result => {
        let unsorted = getunsortedkeyword(result);
        //console.log('maxvalue',unsorted);
        if(Object.keys(unsorted)[0] == 'message'){
            console.log(unsorted['message']);
            
        }else{
            let sorted =sortList(unsorted);
            //console.log('sorted',sorted)
            let topkey = getTopKeyword(sorted);
            getImageFromKeyword(Visitor_ID,topkey,5,distance).then((first)=>{
            let needMore = limit-Object.keys(first).length;
            let firstpart = first;
            if(Object.keys(first).length >= limit){
                console.log("First",first,Object.keys(first).length);
            }else{
                //console.log("firstpart",firstpart,Object.keys(firstpart).length,typeof firstpart);
                let extra = ExtraKey(sorted);
                getImageFromKeywordExtra(Visitor_ID,extra,needMore,distance).then((extra)=>{
                //console.log("ex",extra,Object.keys(extra).length,typeof extra);
                let complete = [...firstpart,...extra];
                console.log("co",complete,Object.keys(complete).length,typeof complete);
                return complete;
            })
        }
        
        })
    }
    })
}
var allexports = {};
allexports.get_keyword_and_score = get_keyword_and_score;
allexports.getunsortedkeyword = getunsortedkeyword;
allexports.sortList = sortList;
allexports.getTopKeyword = getTopKeyword;
allexports.getRecommedImage = getRecommedImage;
allexports.getImageFromKeywordExtra=getImageFromKeywordExtra;
allexports.ExtraKey=ExtraKey;
module.exports = allexports;