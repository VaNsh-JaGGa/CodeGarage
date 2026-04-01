const express = require('express');
const router = express.Router();

//middlewares
const auth = function (req,res,next){
    // make a users object for help
    req.user={
        name:"vansh",
        role:"admin",
    }

    // user hai req object ke andar ab chack krlon user valid hai ya nahi
    if(req.user){
        next();
    }
    res.json({
        success:"fail",
        message:"Not a user",
    })
}
const isStudent  = function(req,res,next){
    if(req.user.role === "student"){
        // res.send("you are in student panel");
        next();
    }
    else{
        res.json({
            success: "fail",
            message: "Not a Student",
        })
    }
}

const isAdmin = function (req, res, next) {
    if (req.user.role === "admin") {
        // res.send("you are in admin panel");
        next();
    }
    else {
        res.json({
            success: "fail",
            message: "access denied",
        })
    }
}

//Routes
router.get('/student', auth, isStudent, (req,res) => {
    console.log("I am Inside Student Route");
    res.send("students Specific Page");
})


router.get('/admin', auth, isAdmin, (req, res) => {
    console.log("I am Inside admin Route");
    res.send("admin Specific Page");
})

module.exports = router;