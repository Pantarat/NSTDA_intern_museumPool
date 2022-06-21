require('dotenv').config();

const express = require('express')
const app = express()
const port = 4000

const bodyParser = require("body-parser");
//Static Files
app.use(express.static('public'))
app.use('/css',express.static(__dirname ='public/css'))
app.use('/js',express.static(__dirname ='public/js'))
app.use('/img',express.static(__dirname ='public/img'))

//Set views
app.set('views','./views')
app.set('view engine','ejs')

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//set cookie parser and flash
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
app.use(cookieParser('SecretStringForCookies'));
app.use(session({
  secret : 'SecretStringForCookies',
  cookie: {maxAge: 60000},
  resave: true,
  saveUninitialized: true
}))
app.use(flash());


var insertRouter = require('./routes/insert');

app.use('/insert',insertRouter)

app.get("",(req,res)=>{
    res.render('index',{text:'This is a pen'})
  })
app.get("/about",(req,res)=>{
    res.render('about',{text:'About?'})
  })
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})