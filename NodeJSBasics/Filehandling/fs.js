const fs = require("fs");

// create and write text in a test.txt file
// -- this is a syncronous file handling call
// fs.writeFileSync("./test.txt","hey i am coming ,vansh jagga");
// create ans write text in a testt.txt file
// -- this is a async call
// fs.writeFile("./testt.txt","gey i am Async",(err)=>{});


// read data from the file synchronously
// let res = fs.readFileSync("./contacts.txt","utf-8");
// console.log(res);

// read data from the file Asynchronously
// in Async you have too pass one more parameter which holds 2 variables in arrow function and can't takle a value in a variable;
// fs.readFile("./contacts.txt","utf-8",(errr,res)=>{
//     if(errr){
//         console.log("error is here",errr);
//     }
//     else{
//         console.log(res);
//         console.log("the file will be readed if everything goes fine");
//     }
// })


// append text in a already made file
// fs.appendFileSync("contacts.txt","Tanishq:8814000320");

// copy a file 
// fs.cpSync("./testt.txt","./copy.txt");

// delete a file 
// fs.unlink("copy.txt",(err)=>{});
// fs.unlinkSync("copy.txt",);

//find the statistics of a file
console.log(fs.statSync("./contacts.txt"));

//create a folder
fs.mkdirSync("WOW_MKDIR_POWER");