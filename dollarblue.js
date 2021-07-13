const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

var config = require('./config');
const api = require('./routes/api');
const session = require('express-session');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
require('./database');
require('./mongo');

var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
const sessionParser = session({
  secret: 'cokse3ur3', resave: true, cookieName: 'sessionName',
  name: 'sessionId', saveUninitialized: true,
  ephemeral: true, // delete this cookie while browser close
  cookie: { secure: false, expires: expiryDate, SameSite : 'Lax',
    maxAge: 24000 * 60 * 60, // One hour
  // domain: 'redpointsmart.com'
  },
  //Aca guardo el session en mongodb
  // store: new MongoStore({url: config.mongoDBReplicaStore}),
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  secret: "super secret",
  db: 'dollarblue',
  collection: 'sessions'
});

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(sessionParser);

// Express Messages Middleware
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.fatal_msg = req.flash('fatal_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// To avoid invalid requests like invalid json format
app.use(function (error, req, res, next) {
    if(error instanceof SyntaxError){ //Handle SyntaxError here.
      return res.status(500).send({Message : "Invalid json format"});
    } else {
      next();
    }
});

  // // Routes
app.all('/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*') // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header("Access-Control-Allow-Credentials", "true");
    // Set custom headers for CORSc
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token,X-Key");
    return next();
});

app.use('/api', api);

//// HTTPS Server ////
const options = {
  key: fs.readFileSync(config.certKey),
  cert: fs.readFileSync(config.certCert),
  ca: fs.readFileSync(config.certCa)
};

var httpsServer = https.createServer(options, app, function (req, res) {  //For local and prod this is ok! (With the certs above)
console.log('request starting...https');
res.writeHead(200, {'Content-Type': 'text/plain'});
res.write('hello client!');
res.end();
});

httpsServer.listen(config.nodeHttpsAppPort, function(req, res) {
  console.log('---------------------------------------------')  
  console.log('--------- Node HTTPS Server Started ---------')
  console.log('---------------------------------------------')
  console.log(httpsServer.address())
  var port = httpsServer.address().port
  console.log('Server is running at', config.nodeApiUrl + ':', port)
});

//// HTTP Server ////
var httpServer = http.Server(app, function (req, res) {  //For local and prod this is ok! (With the certs above)
    console.log('request starting...http');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('hello client!');
    res.end();
});

httpServer.listen(config.nodeHttpAppPort, function(req, res) {
    console.log('---------------------------------------------')
    console.log('-------Node HTTP Server Started-------')
    console.log('---------------------------------------------')
    console.log(httpServer.address())
    var port = httpServer.address().port
    console.log('Server is running at', config.nodeApiUrl + ':', config.nodeHttpAppPort)
});   

app.get('/', function(req, res){
    res.render('layouts/main');
});

//// Web Site Section ////
app.set('views', path.join(__dirname, 'views')); //Load View Engine
app.engine('.hbs', exphbs({
  defaultLayout: 'main', 
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));

app.set('view engine', '.hbs');         // Render View
app.use(express.static(path.join(__dirname, 'public'))); // Set Public Folder
