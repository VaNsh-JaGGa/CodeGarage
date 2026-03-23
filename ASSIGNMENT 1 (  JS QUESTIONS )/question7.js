// let bg = document.querySelector('.button2');
let hide = document.querySelectorAll('.hide');
let table = document.querySelector('.educationTable');
function changeBG(){
    document.body.style.backgroundColor = "red";
}

function changeVisibility(){
    table.style.visibility = "hidden";
}

function hideEducationDetails(){
    table.style.display="none";
}