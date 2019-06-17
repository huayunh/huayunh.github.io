// temporary link hosted on localhost:8080...
// 
// npm install -g localtunnel
// lt --port 8080

const fs = require("fs");
const express = require("express");
const host = "127.0.0.1";
const port = 8080;

var app = express();

app.use(express.static('public'))

app.post('/subjectFinished', function (req, res) {

	// console.log("get a post request");
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