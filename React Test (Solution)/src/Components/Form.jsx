import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import FullName from "./FullName";
import Contact from "./Contact";
import BirthDate from "./BirthDate";
import Email from "./email";
import Password from "./Password";
import ConfirmPassword from "./ConfirmPassword";
import ResetBtn from "./ResetBtn";
import Submit from "./submit";

const Form = ({darkMode}) => {

    const [formData, setFormData] = useState({
        fullNameValue: "",
        contactNumberValue: "",
        emailValue: "",
        passwordValue: "",
        confirmPasswordValue: "",
        day: "",
        month: "",
        year: ""
    });

    const [errors, setErrors] = useState({});

    function valueChanger(e) {
        let name = e.target.name;
        let value = e.target.value;
        let newErrors = {};

        if (e.target.name === "fullNameValue") {
            console.log("inside full name")
            let empty = "";
            if (e.target.value[0] === " ") {
                console.log("colgate")
                setFormData((previousState) => {
                    // console.log(previousState);
                    return { ...previousState, [name]: empty };
                    // console.log(formData);
                });
                return;
            }
        }

        if (e.target.name === "contactNumberValue") {
            let phoneRA = /^\d*$/;

            if (phoneRA.test(e.target.value)) {
                console.log("Good Number");
            }

            else {
                console.log("bahar aa aaagaya yarr");
                return;
            }

            if (e.target.value.length > 10) {
                return;
            }
        }


        setFormData((previousState) => {
            return { ...previousState, [name]: value };
        });

        console.log(name, value);

        if (e.target.name === "fullNameValue") {
            let value = e.target.value;
            let RegexPatternForFullName = /^[A-Za-z]+(?: [A-Za-z]+)?$/

            newErrors.fullNameValue = false;

            if (value.length === 0) {
                newErrors.fullNameValue = true;
            }
            else if (!RegexPatternForFullName.test(value)) {
                newErrors.fullNameValue = true;
            }
            else if (value.endsWith(" ")) {
                newErrors.fullNameValue = true;
            }
            setErrors((prev) => ({
                ...prev,
                ...newErrors
            }));
        }

        if (e.target.name === "contactNumberValue") {
            newErrors.contactNumberValue = false;
            let value = e.target.value;
            let empty = "";
            const phoneRegex = /^\d{10}$/;
            // console.log(e.target.value.length);


            console.log("valllueeee");

            if (value.trim() === "") {
                newErrors.contactNumberValue = true;
            }

            else if (phoneRegex.test(value)) {
                console.log("Phone Number is correct");
            }

            else {
                console.log("Phone Number is Not Can/adian");
                newErrors.contactNumberValue = true;
            }
            setErrors((prev) => ({
                ...prev,
                ...newErrors
            }));
        }


        if (e.target.name === "emailValue") {
            newErrors.emailValue = false;
            let value = e.target.value;
            let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (value.trim() === "") {
                console.log("Error in Email");
                newErrors.emailValue = true;
            }

            else if (emailRegex.test(value)) {
                console.log("email is correct");
            }

            else {
                console.log("Error in Email");
                newErrors.emailValue = true;
            }
            setErrors((prev) => ({
                ...prev,
                ...newErrors
            }));
        }

        let passwordWalue;
        if (e.target.name === "passwordValue") {
            newErrors.passwordValue = false;
            let value = e.target.value;
            let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
            if (value.trim() === "") {
                console.log("password is Incorrect"); ``
                newErrors.passwordValue = true;
            }

            else if (passwordRegex.test(value)) {
                console.log("Password is correct");
            }

            else {
                console.log("password is Incorrect");
                newErrors.passwordValue = true;
            }
            setErrors((prev) => ({
                ...prev,
                ...newErrors
            }));
            passwordWalue = value;
        }


        if (e.target.name === "confirmPasswordValue") {
            newErrors.confirmPasswordValue = false;
            let value = e.target.value;
            console.log(passwordWalue);
            console.log(value);
            console.log("gfff")
            if (value.length < 8) {
                newErrors.confirmPasswordValue = true;
            }

            else if (value === formData.passwordValue) {
                console.log("Password is Confirmed");
            }

            else {
                newErrors.confirmPasswordValue = true;
            }
            setErrors((prev) => ({
                ...prev,
                ...newErrors
            }));
        }

    }

    function submitHandler(e) {
        e.preventDefault();
        let newErrors = {};

        //Full Name ---
        let fullNameLastIndex = formData.fullNameValue.length - 1;
        let fullNameLastIndexValue = formData.fullNameValue[fullNameLastIndex];
        let RegexPatternForFullName = /^[A-Za-z\s]+$/;
        console.log(fullNameLastIndexValue);

        if (formData.fullNameValue.trim() === "") {
            newErrors.fullNameValue = true;
        }

        else if (fullNameLastIndexValue === " ") {
            newErrors.fullNameValue = true;
        }

        else if (RegexPatternForFullName.test(formData.fullNameValue)) {
            console.log("name is Good And Accepted");
        }

        else {
            newErrors.fullNameValue = true;
        }


        //phone Number
        const phoneRegex = /^[0-9]{0,10}$/;

        if (formData.contactNumberValue.trim() === "") {
            newErrors.contactNumberValue = true;
        }

        else if (phoneRegex.test(formData.contactNumberValue)) {
            console.log("Phone Number is correct");
        }

        else {
            console.log("Phone Number is Not Can/adian");
            newErrors.contactNumberValue = true;
        }

        //Birth Date
        //Day
        if (formData.day.trim() === "") {
            console.log("Day is Empty");
            newErrors.day = true;
        }

        //Month
        if (formData.month.trim() === "") {
            console.log("Month is Empty");
            newErrors.month = true;
        }

        //Year
        if (formData.year.trim() === "") {
            console.log("year is Empty");
            // return;
            newErrors.year = true;
        }


        //Email Address
        let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (formData.emailValue.trim() === "") {
            console.log("Error in Email");
            newErrors.emailValue = true;
        }

        else if (emailRegex.test(formData.emailValue)) {
            console.log("email is correct");
        }

        else {
            console.log("Error in Email");
            newErrors.emailValue = true;
        }

        // Password
        let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/;
        if (formData.passwordValue.trim() === "") {
            console.log("password is Incorrect"); ``
            newErrors.passwordValue = true;
        }

        else if (passwordRegex.test(formData.passwordValue)) {
            console.log("Password is correct");
        }

        else {
            console.log("password is Incorrect");
            newErrors.passwordValue = true;
        }

        // Confirm Password
        if (formData.confirmPasswordValue.length < 8) {
            newErrors.confirmPasswordValue = true;
        }

        else if (formData.confirmPasswordValue === formData.passwordValue) {
            console.log("Password is Confirmed");
        }

        else {
            newErrors.confirmPasswordValue = true;
        }

        console.log(newErrors);
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast("There was an error creating the account", {
                style: {
                    background: "#FFC0C0",
                    color: "#000",
                    border: "1px solid #FF6B6B",
                }
            });
            return;
        }

        console.log("very Near to end");
        toast("User form successfully created", {
            style: {
                background: "#CDFADC",
                color: "black",
                border: "1px solid #CDFADC",
                borderRadius: "10px"
            }
        });
    }

    function ResetForm() {
        setFormData({
            fullNameValue: "",
            contactNumberValue: "",
            emailValue: "",
            passwordValue: "",
            confirmPasswordValue: "",
            day: "",
            month: "",
            year: ""
        });
        setErrors({});
    }

    const width = window.innerWidth;

    return (
        <>
            {width > 400 && (
                <ToastContainer
                    hideProgressBar={true}
                    ClassName="
                    position: relative
                    top: 60px        
                    right: 200px
                    "
                />
            )}
            <form onSubmit={submitHandler}>

                <div className={`max-w-[450px] max-h-[600px] w-full mx-auto 

                flex flex-col gap-4 mt-6 px-4 ${darkMode ? "bg-gray-700 text-white" : ""}`}>

                    <div className="text-xl font-semibold max-w-[450px] ">
                        Create User Account
                    </div>

                    <div className="w-full flex flex-col p-6 gap-5 h-[710px] 
                    shadow-xl/20 rounded-sm">

                        <FullName errors={errors} formData={formData} onChangeHandler={valueChanger} darkMode={darkMode} />

                        <Contact errors={errors} formData={formData} onChangeHandler={valueChanger} darkMode={darkMode} />

                        <BirthDate errors={errors} formData={formData} onChangeHandler={valueChanger} darkMode={darkMode} />

                        <Email errors={errors} formData={formData} onChangeHandler={valueChanger} darkMode={darkMode} />

                        <Password errors={errors} formData={formData} onChangeHandler={valueChanger} darkMode={darkMode} />

                        <ConfirmPassword errors={errors} formData={formData} onChangeHandler={valueChanger} darkMode={darkMode} />


                        {width <= 400 && (
                            <ToastContainer
                                position="top-center"
                                hideProgressBar={true}
                                className="!relative !w-full !mt-2"
                                toastClassName="
                                w-full 
                                bg-[#FFC0C0] 
                                border border-[#FF6B6B] 
                                text-black 
                                rounded-md 
                                p-3 
                                text-sm
                                "
                            />
                        )}

                    </div>

                    <div className="flex flex-col md:flex-row gap-3 mt-4 items-center md:justify-center w-full">

                        <ResetBtn onReset={ResetForm} />

                        <Submit onSubmit={submitHandler} />

                    </div>

                </div>
            </form >

        </>
    )
}
export default Form