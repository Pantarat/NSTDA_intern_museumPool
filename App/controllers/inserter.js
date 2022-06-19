const model = require('../models/insert')
module.exports ={
    main : function(req, res, next) {
        res.render('insert');
    },
    insert_form : function(req, res, next) {
        res.render('insert_one_form');
    },
    insert_One : function(req, res, next) {
        model.insert_one_model(req)
        res.redirect('/insert');//redirectกลับไปหน้าริ่ม   
    },
    insert_Update : function(req, res, next) {
        console.log('done55');
        model.insert_update_model;
        res.redirect('/');
    }

}