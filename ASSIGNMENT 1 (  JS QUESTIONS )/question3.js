// 3. Create a javascript array to store the names of students in a class. On loading the page, the script 
// should pick up a random student and display his name in the alert box.

console.log('hello');

let nameOfStudents = ['vansh','radhika','ujjwal','sujal','tanishq'];
console.log(nameOfStudents[0]);
let arraySize = nameOfStudents.length;
console.log(arraySize);

let RandomIndex = Math.floor(Math.random() * arraySize);
console.log(RandomIndex);

window.addEventListener('load',change);

function change(event){
    alert(nameOfStudents[RandomIndex]);
}

