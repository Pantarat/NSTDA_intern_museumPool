const model = require('../models/insert')
module.exports ={
    main : function(req, res, next) {
        const feedback = req.flash('feedback')

        res.render('insert',{feedback});
    },
    insert_form : function(req, res, next) {
        res.render('insert_one_form');
    },
    insert_One : function(req, res, next) {
        model.insert_one_model(req)
        req.flash('feedback','Insert one Completed')
        res.redirect('/insert');//redirectกลับไปหน้าริ่ม   
    },
    insert_Update : function(req, res, next) {
        console.log('done55');
        model.insert_update_model();
        req.flash('feedback','Update Completed')
        res.redirect('/insert');
    }

}