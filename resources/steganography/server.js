// var http = require('http');
// var fs = require('fs');

// http.createServer(function(req, res){
//     fs.readFile('test.html',function (err, data){
//         res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
//         res.write(data);
//         res.end();
//     });
// }).listen(8000);

var fs = require("fs");
var host = "127.0.0.1";
var port = 8000;
var express = require("express");

var app = express();

app.use(express.static('public'))

app.listen(port, host);