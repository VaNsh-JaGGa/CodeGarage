const express = require('express')
const app = express()

app.use(function(req,res,next){
    console.log("hello mere gullu");
    next();
})

app.get("/",function(req,res){
    res.send("champion mera ujjwal");
})


app.get("/profile", function (req, res) {
    res.send("champion uska coach");
})

// app.listen(3000, () => {
//     console.log('Server is running on http://localhost:3000')
// })
app.listen(3000);