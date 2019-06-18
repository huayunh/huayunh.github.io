// temporary link hosted on localhost:8080...
// 
// npm install -g localtunnel
// lt --port 8080

const fs = require("fs");
const express = require("express");
// const host = "127.0.0.1";
const host = "0.0.0.0";
const port = 8080;

var app = express();

app.use(express.static('public'))

app.post('/subjectFinished', function (req, res) {

	var body = '';
    filePath = __dirname + '/log/';
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }

    var receivedTime = new Date();
    req.on('data', function(data) {
        body += data;
        data = JSON.parse(data);
        filePath += data.category + '-' + receivedTime.getTime() + '.json';
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
console.log("listening on " + host + ":" + port);