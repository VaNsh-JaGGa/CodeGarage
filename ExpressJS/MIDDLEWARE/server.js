const express = require('express');
const app = express();
const port = 3000;

//inbuild middleware - express.json() ( parse the data to object )
// app.use(express.json());

//creating the custom midddleware (Application level middleware)
// const mylogger = function(req,res,next){
//     console.log("I AM LOGGED IN");
//     next();
// }
// //loading the middleware in the application
// app.use(mylogger);

// const auth = function (req, res, next) {
//     console.log("I AM auth");
//     next();
// }
// app.use(auth);

// third party middleware --- install through npm and then use

//error-handling middleware
// const errorHandlerMiddleware  = function(err,req,res,next){
//     res.status(404).json({
//         name : "User Not Found",
//         messsage : err.messsage
//     })
// }

// app.get('/',(req,res)=>{
//     res.send("i am viratttt");
// })

// app.get('/home', (req, res,next) => {
//     // res.send("i am viratttt");
//     const user = null;
//     if(!user){
//         const error = new Error("User not Found");
//         next(errorHandlerMiddleware);
//     }
// })

const route = require('./Routes/route')
// mounting the routes 
app.use('/api',route)


app.listen(3000,function(req,res){
    console.log("server is running on the port 3000");
})