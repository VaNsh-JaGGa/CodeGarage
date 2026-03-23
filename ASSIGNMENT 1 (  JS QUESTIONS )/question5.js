// 5. Take the names as input from a dialog. The dialog should keep asking names till a checkbox on the 
// dialog which says stop further dialogs is checked. After that display the names in alphabetical order 
// which were entered through alert box.​

let arr = [];
let flag = false;

while(!flag){
    let person = prompt("ENTER YOUR Name SIR"," ");
    arr.push(person);

    flag = confirm("click OK to stop");
    // flag = false;
    // if(help ==  )
}
arr.sort();

for(let item of arr){
    console.log(item);
}