const http = require('http');
const fs = require('fs');

const myServer = http.createServer((req,res)=>{
    console.log(req);
    const log = `${Date.now()} ${req.url} + timestamp\n`;
    fs.appendFile("log.txt",log,(err,data)=>{
        switch(req.url){
            case "/":
            res.end("hey i am striver");
            break;
            case "/about":
            res.end("hey i am vansh always in home");
        }
    })
});

myServer.listen(8000,()=>{console.log("server is running !!!!!!")});