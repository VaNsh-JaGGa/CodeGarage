
// let form = document.querySelector('#yourFormId');
// form.addEventListener('submit', function (e) {

//     //first Name
//     let isvalid = true;
//     e.preventDefault();
//     let firstNameHolder = document.querySelector(".firstName");
//     // let nameRegex = /^[A-Za-z\s]+$/;
//     // firstNameHolder.addEventListener("change", ValidatefirstName);
//     let minlength = 2;
//     let firstNameValue = firstNameHolder.value;
//     ValidatefirstName();
//     function ValidatefirstName() {
//         // firstNameValue = firstNameHolder.value;
//         if (firstNameValue === "") {
//             alert("Please Enter the first Name");
//             isvalid = false;
//             return;
//         }

//         else if (firstNameValue[0] === " ") {
//             alert("firstName should not be empty");
//             isvalid = false;
//             return;
//             // secondNameHolder.value="";
//         }

//         // else if (nameRegex.test(firstNameValue)) {
//         //     return false;
//         //     // secondNameHolder.value="";
//         // }

//         else if (firstNameValue.length < minlength) {
//             alert("please Enter atleast 2 characters");
//             isvalid = false;
//             return;
//         }
//     }

//     if(!isvalid){
//         return;
//     }

//     //second Name
//     let secondNameHolder = document.querySelector(".lastName");
//     // secondNameHolder.addEventListener("change", ValidateLastName);
//     secondNameValue = secondNameHolder.value;
//     ValidateLastName();
//     function ValidateLastName() {   
//         if (secondNameValue[0] == " " || secondNameValue == "") {
//             alert("SecondName should not be empty");
//             isvalid = false;
//             // secondNameHolder.value="";
//         }
//         else if (secondNameValue.length < minlength) {
//             alert("please Enter atlest 2 characters");
//             isvalid = false;
//             return
//             // secondNameHolder.value="";
//         }
        
//     }

    
//     if(!isvalid){
//         return;
//     }


//     // EMAIL
//     let emailHolder = document.querySelector('.Regexx');
//     let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     // emailHolder.addEventListener("change", validateEmail);
//     value = emailHolder.value;
//     validateEmail();
//     function validateEmail(event) {
//         console.log("run");
//         console.log(value);

//         if (emailRegex.test(value)) {
//             console.log("goood email")
//         }
//         else {
//             alert("wrong email format");
//             isvalid = false;
//             return false;
//             // emailHolder.value="";
//         }
//     }


    
//     if(!isvalid){
//         return;
//     }


//     // ph no 
//     let phoneRegex = /^\d{3}\d{3}\d{4}$/;
//     let phoneHolder = document.querySelector('.phoneRegex');

//     // let phoneValue = "";
//     // phoneHolder.addEventListener('change', validatePhoneNumber);
//     let phoneValue = phoneHolder.value;
//     validatePhoneNumber();
//     function validatePhoneNumber() {
//        if(phoneValue == "e"){
//         alert("e is not valid");
//        }

//         else if (phoneRegex.test(phoneValue)) {
//             console.log("ph value is correct");
//         }
//         else {
//             alert("phone number is not valid");
//             isvalid = false;
//         }
//         // phoneHolder.value="";
//     }

    
//     if(!isvalid){
//         return;
//     }

//     // // - Date of Birth: Required field, should be a past date.
//     let date = document.querySelector(".date");
//     let todayDate = new Date();

//     // date.addEventListener("change", validateDOB);
//     validateDOB();
//     function validateDOB(event) {
//         let selectedDate = new Date(date.value);
//         if (selectedDate < todayDate) {
//             console.log("goodOne");
//         }
//         else {
//             alert("Entered Age is not Valid");
//             isvalid = false;
//             date.value = "";
//         }
//     }


//     if(!isvalid){
//         return;
//     }


//     // // Gender: At least one option must be selected.
//     let gender = document.querySelector("input[name=gender]:checked");
//     // gender.addEventListener("change", ValidateGender);

//     ValidateGender();
//     function ValidateGender() {
//         if (gender == null) {
//             alert("select the gender");
//             isvalid = false;
//         }
//         else {
//             console.log("gender is" + gender.value);
//         }
//     }

//     if(!isvalid){
//         return;
//     }

//     // this.reset();
//     let agreement = document.querySelector(".agg");
//     if(!agreement.checked){
//         alert("please agree with the agreement");
//         isvalid = false;
//     }

    
//     if(!isvalid){
//         return;
//     }

//     if(isvalid==true){
//         alert("Form Is Submitted");
//     }

// });

// // button.addEventListener("click",last);

// // let emp = document.querySelector(".empty");

// // function last(event){
// //     event.preventDefault();
// //     let fname = document.querySelector(".fn").value;

// //     emp
// // }

// // this.reset();

// // let firstName = document.querySelector("#firstName");
// // firstName.addEventListener("change",fname);

// // function fname(){
// //     let fnv = firstName.value;
// // }

// // document.appendChild(fnv);
