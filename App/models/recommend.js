const sim = require('./similarity');
const top = require('./topKeyword');

async function getRecommended(Visitor_ID,Method = 'TOPKEY',limit = 10,distance = 500){
    if (Method = 'SIMILAR'){
        return await sim.getRecommedImage(Visitor_ID, limit, distance);
    }
    else if (Method = 'TOPKEY'){
        return await top.getRecommedImage(Visitor_ID,limit,distance);
    }
    else {
        console.log(`No method = ${Method} available, Please choose between SIMILAR or TOPKEY`);
    }
}

let recommendExports = {}
recommendExports.getRecommended = getRecommended;

module.exports = recommendExports;