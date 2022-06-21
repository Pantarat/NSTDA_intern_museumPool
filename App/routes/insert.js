var express = require('express');
var router = express.Router();
const inserter = require('../controllers/inserter');

//main
router.get('/',inserter.main);

//single value
router.get('/insert_form',inserter.insert_form);

router.post('/insert_one',inserter.insert_One);

router.get('/insert_update',inserter.insert_Update);

//main
router.get('/1',inserter.main1);

//single value
router.get('/insert_form1',inserter.insert_form1);

router.post('/insert_one1',inserter.insert_One1);

router.get('/insert_update1',inserter.insert_Update1);


module.exports = router;