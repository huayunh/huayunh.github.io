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

var filePath = __dirname + '/log/';

app.use(express.static('public'))

app.post('/subjectFinished', function (req, res) {

    var body = '';
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }
    var chunks = []

    req.on('data', function(data) {
        chunks.push(data);

    }).on('end', function (){
        let data   = Buffer.concat(chunks).toString();
        let saveToPath = filePath + (new Date()).getTime();

        // in case two files come in at the same time
        if (!fs.existsSync(saveToPath + '.json')) {
            fs.writeFile(
                saveToPath + '.json', // file path
                data, 
                'utf8', 
                (err) => {
                    if (err) {
                        console.log(err);
                    }
            });
        } else {
            fs.writeFile(
                saveToPath + ' 2.json',
                data, 
                'utf8', 
                (err) => {
                    if (err) {
                        console.log(err);
                    }
            });
        }
        
        res.end();
    });
})

app.listen(port, host);
console.log("listening on " + host + ":" + port);