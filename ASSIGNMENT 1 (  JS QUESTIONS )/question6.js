let firstButton = document.querySelector(".pv");

function previousPage(event){
    // event.preventDefault();
    window.history.back();
}

function nextPage(event){
    // event.preventDefault();
    window.history.forward();
}