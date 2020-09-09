var request = require("request");
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const https = require('https');
const fs = require('fs');
const app = express();

var config = require('./config');
const api = require('./routes/api');


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

app.use('/getdollarblue', api);

var dolarblueurl = "https://mercados.ambito.com//dolar/informal/variacion";

request({
    url: dolarblueurl,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        console.log(body) // Print the json response
    }
})
      
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
    res.send('Hello World');
  });