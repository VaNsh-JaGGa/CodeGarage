let maxDate = document.querySelector(".lastTry");
let newwDate = new Date().toISOString().split("T")[0];
console.log(new Date().toISOString().split("T"))
console.log(new Date().toISOString().split("T")[0])
// console.log(new Date().toISOString().split("T")[4])
console.log(newwDate);
maxDate.max = newwDate;

let phoneHolder = document.querySelector('.phoneRegex');

// This logic runs every time a key is pressed in the Phone Number box
phoneHolder.addEventListener('keydown', function (e) {
    // Check if the key being pressed is 'e' or 'E'
    if (e.key === 'e' || e.key === 'E') {
        // alert("The character 'e' is not allowed in the phone number field.");
        e.preventDefault();
    }
});

let form = document.querySelector('#yourFormId');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let minlength = 2;

    // --- 1. FIRST NAME ---
    let firstNameHolder = document.querySelector(".firstName");
    let firstNameValue = firstNameHolder.value;
    let firstIndex = firstNameValue[0];
    if (firstNameValue !== "") {

        if (firstIndex == " ") {
            alert("first Name is empty");
            return;
        }

        else if (firstNameValue.length < minlength) {
            alert("First Name must be at least 2 characters");
            return;
        }
    }

    // --- 2. LAST NAME ---
    let secondNameHolder = document.querySelector(".lastName");
    let secondNameValue = secondNameHolder.value;
    let secondIndex = secondNameValue[0];
    if (secondNameValue !== ""){
        if (secondIndex == " ") {
            alert("last name is empty");
            return;
        }
        else if (secondNameValue.length < minlength) {
            alert("Last Name must be at least 2 characters");
            return;
        }
    }

    // --- 3. EMAIL ---
    let emailHolder = document.querySelector('.Regexx');
    let emailValue = emailHolder.value;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue !== "") {
        if (!emailRegex.test(emailValue)) {
            alert("Wrong email format");
            return;
        }
    }

    // --- 4. PHONE NUMBER ---
    let phoneValue = phoneHolder.value;
    let phoneRegex = /^\d{10}$/; 
    if (phoneValue !== "") {
        if (!phoneRegex.test(phoneValue)) {
            alert("Phone number is not valid");
            return;
        }
    }

    // --- 5. DATE OF BIRTH ---
    let dateHolder = document.querySelector(".date");
    let todayDate = new Date();
    console.log(dateHolder);
    if (dateHolder.value !== "") {
        let selectedDate = new Date(dateHolder.value);
        if (selectedDate >= todayDate) {
            alert("Entered Age is not Valid");
            dateHolder.value="";
            return;
        }
    }

    // ---OTHER FIELDS ---
    let gender = document.querySelector("input[name=gender]:checked");
    let agreement = document.querySelector(".agg");

    if (!gender) {
        alert("Please select a gender");
        return;
    }

    if (!agreement.checked) {
        alert("Please agree with the agreement");
        return;
    }

    if(firstNameValue == ""){
        alert("Enter First Name");
        return;
    }

    if(secondNameValue == ""){
        alert("Enter second Name");
        return;
    }

    if(emailValue == ""){
        alert("Enter email");
        return;
    }

     if(phoneValue == ""){
        alert("Enter Phone Number");
        return;
    }
    if(dateHolder.value == ""){
        alert("Enter Date Of Birth");
        return;
    }
    alert("Form Is Submitted");
});