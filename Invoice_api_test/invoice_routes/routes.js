const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const app = express();

const dbCon = mysql.createConnection({
    host: 'localhost',
    user: 'Zake',
    password: '1234',
    database: 'sql_invoicing',
})

dbCon.connect()

//create new invoice
router.post('', (req,res) => {
    let newinv_number = req.body.invoice_number;
    let newinv_client_id = req.body.client_id;
    let newinv_client_name = req.body.client_name;
    let newinv_total = req.body.invoice_total;
    let newinv_payment = req.body.payment_total;

    //validate
    let errmsg = "Errors are";
    let err = false;
    const regexNumber = /^[0-9]{2}-[0-9]{3}-[0-9]{4}$/; //create number pattern using regular expression
    if(!regexNumber.test(newinv_number)){
        errmsg += ', Please provide invoice number in form of xx-xxx-xxxx';
        err = true;
    }
    if(newinv_client_name.length == 0){
        errmsg += ', Please provide valid name';
        err = true;
    }
    if(newinv_client_id < 1){
        errmsg += ', Client id must be at least 1';
        err = true;
    }
    if(newinv_total < 0 || newinv_payment < 0){
        errmsg += ', Invoice total and payment must be greater than zero';
        err = true;
    }
    if(err) return res.status(400).send({ error: true, message: errmsg })
    else{
        dbCon.query("INSERT INTO good_invoices (invoice_number,client_id,client_name,invoice_total,payment_total) VALUES (?,?,?,?,?)",[newinv_number,newinv_client_id,newinv_client_name,newinv_total,newinv_payment], (error,results,fields) => {
            if (error) throw error;
            res.send({ error: false, data: results, message: 'New invoice succesfully added'});
        })
    }
})

//read all invoices
router.get('', (req,res) => {
    dbCon.query('SELECT * FROM good_invoices', (error,results,fields) => {
        if (error) throw error;
        res.send({ error: false, data: results, message: 'Succesfully retrieved all invoices'});
    })
})

//read invoice by id
router.get('/:id', (req,res) => {
    let id = req.params.id;

    //validate
    if(!id){
        return res.status(400).send({ error: true, message: 'ID not found'})
    }else{
        dbCon.query('SELECT * FROM good_invoices WHERE invoice_id = ?',id, (error,results,fields) => {
            if(error) throw error;

            let msg = "";
            if(results === undefined || results.length == 0){
                msg = `No invoice with id = ${id}`;
            }
            else{
                msg = 'Succesfully retrieved invoice';
            }
            return res.send({ error: false, data: results, message: msg});
        })
    }
})

//update invoice by id
router.put('/:id', (req,res) => {
    let id = req.params.id; 
    let newinv_number = req.body.invoice_number;
    let newinv_client_id = req.body.client_id;
    let newinv_client_name = req.body.client_name;
    let newinv_total = req.body.invoice_total;
    let newinv_payment = req.body.payment_total;
    //validate
    if(!id){
        return res.status(400).send({ error: true, message: 'ID not found'})
    }
    let errmsg = "Errors are";
    let err = false;
    const regexNumber = /^[0-9]{2}-[0-9]{3}-[0-9]{4}$/; //create number pattern using regular expression
    if(!regexNumber.test(newinv_number)){
        errmsg += ', Please provide invoice number in form of xx-xxx-xxxx';
        err = true;
    }
    if(newinv_client_name.length == 0){
        errmsg += ', Please provide valid name';
        err = true;
    }
    if(newinv_client_id < 1){
        errmsg += ', Client id must be at least 1';
        err = true;
    }
    if(newinv_total < 0 || newinv_payment < 0){
        errmsg += ', Invoice total and payment must be greater than zero';
        err = true;
    }
    if(err) return res.status(400).send({ error: true, message: errmsg })
    else{
        dbCon.query('UPDATE good_invoices SET invoice_number = ?, client_id = ?, client_name = ?, invoice_total = ?, payment_total = ? WHERE invoice_id = ?',[newinv_number,newinv_client_id,newinv_client_name,newinv_total,newinv_payment,id], (error,results,fields) =>{
            if (error) throw error;
            let msg = "";
            if(results === undefined || results.length == 0){
                msg = `No Invoice of id ${id}`;
            }else{
                msg = `Invoice id ${id} is succesfully updated`;
            }
            res.send({ error: false, data: results, message: msg})
        })
    }
})

//delete an invoice by id
router.delete('', (req,res) => {
    let id = req.body.invoice_id;
    //validate
    if(!id){
        return res.status(400).send({ error: true, message: 'ID not found'})
    }else{
        dbCon.query('DELETE FROM good_invoices WHERE invoice_id = ?',id, (error,results,fields) => {
            if(error) throw error;
            if(results === undefined || results.length == 0){
                msg = `No Invoice of id ${id}`;
            }else{
                msg = `Invoice id ${id} is succesfully deleted`;
            }
            res.send({ error: false, data: results, message: msg})
        })
    }
    
})



module.exports = router;