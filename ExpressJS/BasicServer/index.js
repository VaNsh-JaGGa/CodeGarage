const express = require('express');
const app = express();
// server is created

// creating a basic route 
app.get("/",function(req,res){
    res.send("hey i am home page");
})


app.listen(3000,()=>{
    console.log("hello i am running on the port number 3000 !!!!!!!!!!");
})