// 4. Take a static integer array. The script should show the average of the integers in the alert box.

let staticArray = [1,2,3,4,5];
let sum = 0;
let arraySize = staticArray.length;

for(let item of staticArray){
    console.log(item);
    sum = sum + item;
}

let average  = (sum / arraySize);
alert(average);