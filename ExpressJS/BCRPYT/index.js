const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const port  = 3000;

const plainPassword = "123456";
const SaltRounds = 10;

async function HasingPassword(){
    const HashedPassword = await bcrypt.hash(plainPassword, SaltRounds);
    console.log(HashedPassword);
    const isMatch = await bcrypt.compare("123456", HashedPassword);
    if(!isMatch){
        console.log("Wrong Password")
    }
    else{
        console.log("Password is Correct");
    }
}
HasingPassword();

app.listen(port,()=>{
    console.log("Server Is Running");
})

