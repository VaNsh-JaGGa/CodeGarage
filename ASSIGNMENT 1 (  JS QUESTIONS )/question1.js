// about date object first 
// let a = new Date();
// toDateString() -- it is  a method which makes the date object (returns in string)
// a = a.toDateString();
// console.log(a);
// toutcstring();
// a = a.toUTCString();
// console.log(a);
// console.log(typeof(a));

// ISOstring 
// a = a.toISOString();
// console.log(a);
// let date = a.getUTCDate();
// console.log(date);
// let hour = a.getUTCHours();
// console.log(hour);
// let day = a.getUTCDay();
// console.log(day);










// 1. Create a script to show date and time on javascript page. Show UTC time as well.
let a = new Date();
let localDate = a.getDate();
console.log(localDate);
let localTime = a.getTime();
console.log(localTime);

let WorldTime = a.toUTCString();
console.log(WorldTime);