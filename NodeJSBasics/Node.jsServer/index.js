// console.log("hello");

// we want to make the http server so first take the module http
// http.createServer() ,this created a web server for us 
// in web server the request are coming from the client to handle that request , request handler comes and it have 2 params
// we pass the arrow function in createServer which is responsible for process the incoming request
// it have two params req and res , the req hold who is requesting the data of client in short words 
// we use the res variable to send the response

// to run the server we need the port no , now we will make the server to listen on that port number.

const http = require("http");
const fs = require("fs");

const myServer = http.createServer((req,res)=>{
    // console.log(req);
    const log = `${Date.now()} : timeStamp`;
    fs.appendFile("log.txt",log,(err,data)=>{
        res.end("hello from Vansh");
    })
})

myServer.listen(8000,()=>{console.log("Helloo Sever Is Started")});