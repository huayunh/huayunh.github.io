const fs = require("fs");
// const readline = require('readline');
const express = require("express");
// const {google} = require('googleapis');

const host = "127.0.0.1";
const port = 8000;

var app = express();

app.use(express.static('public'))

app.post('/subjectFinished', function (req, res) {

	console.log("get a post request");
	var body = '';
    filePath = __dirname + '/log/';
    req.on('data', function(data) {
        body += data;
        data = JSON.parse(data);
        filePath += data.category + '-' + data.startTime + '.json';
    });

    req.on('end', function (){
        fs.writeFile(filePath, body, 'utf8', (err) => {
        	if (err) {
        		console.log(err);
        	}
        });
        res.end();
    });
})

app.listen(port, host);