var express = require('express');
var router = express.Router();
const inserter = require('../controllers/inserter');

//main
router.get('/',inserter.main);
//single value
router.get('/insert_form',inserter.insert_form);

router.post('/insert_one',inserter.insert_One);

router.get('/insert_update',inserter.insert_Update);


module.exports = router;