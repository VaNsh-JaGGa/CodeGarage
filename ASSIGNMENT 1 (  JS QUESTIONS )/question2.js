// 2. Create a html page which asks a question like 3+4? and 
// shows an input box to enter the answer. if the answer is correct, 
// then the script shows a dialog box to tell if the answer is correct or not.


// let firstValue = Math.round(Math.random()*10);
// console.log(firstValue);
// firstValue = (Math.round(firstValue));
// console.log(firstValue);
let firstValue = Math.round(Math.random()*10);
let secondValue = Math.round(Math.random()*10);


console.log(firstValue);
console.log(secondValue);

let firstElementHolder = document.querySelector(".need1");
firstElementHolder.textContent=firstValue;
console.log(firstElementHolder);

let secondValueHolder = document.querySelector(".need2");
secondValueHolder.textContent=secondValue;

let input = document.querySelector(".fielder");
input.addEventListener("change",changer);

let InputValue;
// let InputValue = input.textContent;
// let Input
function changer(event){
    InputValue = input.value;
    console.log(InputValue);
}

let submitButton = document.querySelector(".Btn");
submitButton.addEventListener("click",submitt);

function submitt(event){
    event.preventDefault();
    if(InputValue == (firstValue + secondValue)){
        alert("correct");
    }
    else{
        alert("not correct");
    }
}









// let ButtonHolder = document.querySelector(".Btn");

// let EnteredValue = function 

// ButtonHolder.addEventListener("click",calculate());
// function calculate(){

// }

