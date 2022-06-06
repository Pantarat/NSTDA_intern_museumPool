const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));



//Main menu path
app.get('/',(req,res) => {
    return res.send({
        error: false,
        message: 'Test api with invoice database',
        written_by: 'Pantarat Vichathai'
    })
})

app.use('/invoices', require('./invoice_routes/routes.js')); //for routing app.use(urlpath, import route package)

const PORT = process.env.PORT || 1000;

app.listen(PORT,() => {
    console.log(`Node app is running on port: ${PORT}`);
})