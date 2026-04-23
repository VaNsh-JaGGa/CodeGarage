// protected middleware har request me dekhega user login hai na
const jwt = require("jsonwebtoken");
const { User } = require("../models/index");
require("dotenv").config();


const protect = (req,res,next)=>{
    // req.header.authorization me jaha token hota hai vaha se token lao or dekho ye user loggedin hai ya nahi 
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            res.status(401).json({message:"No Token, Access Denied"})
        }
        console.log("this is auth Header");
        console.log(authHeader);
        // agar yaha aagaye too authHeader me token haai tooo split method ka use krke token ki value nikal lon.
        const token = authHeader.split(" ")[1]; // iisse hame token mil jayega ("edegyedgeifeyfrbfkewiaufgerugfwu3e73t26er4frvy4")
        console.log("Token Finded vo bhi bina bearer vala");
        console.log(token);
        //it will first check whether the secret key is valid
        // then secondly it will check whether the token is expired or not , if yes throws an error
        // after these two steps of verification ,the jwt.verify also gives the payload ,that is given when creation of the token.
        const decoded  = jwt.verify(token,process.env.JWT_SECRET);
        // the decoded will hold something like this {id:1,role:"onwer"}

        const user = User.findByPk(decoded.id);
        if(!user || user.token != token){
            return res.status(401).json({
                message:"Token Not Found In User Record"
            })
        }
        
        req.user = {id:user.id,role:user.role,name:user.name};
        next();
    }

    catch{
        return res.status(401).json({
            message:"Token Verification Failed"
        })
    }
};

module.exports = { protect };