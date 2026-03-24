import { validateField } from "../utils/formUtils";
import { submitUtils } from "../utils/submitUtils";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import FullName from "./FullName";
import Contact from "./Contact";
import BirthDate from "./BirthDate";
import Email from "./email";
import Password from "./Password";
import ConfirmPassword from "./ConfirmPassword";
import ResetBtn from "./ResetBtn";
import Submit from "./submit";

const Form = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    fullNameValue: "",
    contactNumberValue: "",
    emailValue: "",
    passwordValue: "",
    confirmPasswordValue: "",
    day: "",
    month: "",
    year: "",
  });

  const [errors, setErrors] = useState({});

  function valueChanger(e) {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "fullNameValue" && value[0] === " ") return;

    if (name === "contactNumberValue") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const newErrors = validateField(name, value, {
      ...formData,
      [name]: value,
    });

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));
  }

  function submitHandler(e) {
    e.preventDefault();
    const newErrors = submitUtils(formData);

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast("There was an error creating the account", {
        style: {
          background: "#FFC0C0",
          color: "#000",
          border: "1px solid #FF6B6B",
        },
      });
      return;
    }

    toast("User form successfully created", {
      style: {
        background: "#CDFADC",
        color: "black",
        border: "1px solid #CDFADC",
        borderRadius: "10px",
      },
    });

    if (Object.keys(newErrors).length > 0) {
      toast("There was an error creating the account", {
        style: {
          background: "#FFC0C0",
          color: "#000",
          border: "1px solid #FF6B6B",
        },
      });
      return;
    }

    console.log("very Near to end");
    toast("User form successfully created", {
      style: {
        background: "#CDFADC",
        color: "black",
        border: "1px solid #CDFADC",
        borderRadius: "10px",
      },
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
      year: "",
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
        <div
          className={`max-w-[450px] max-h-[600px] w-full mx-auto flex flex-col gap-4 mt-6 px-4 ${darkMode ? "bg-gray-700 text-white" : ""}`}
        >
          <div className="text-xl font-semibold max-w-[450px] ">
            Create User Account
          </div>

          <div
            className="w-full flex flex-col p-6 gap-5 h-[710px] 
                    shadow-xl/20 rounded-sm"
          >
            <FullName
              errors={errors}
              formData={formData}
              onChangeHandler={valueChanger}
              darkMode={darkMode}
            />

            <Contact
              errors={errors}
              formData={formData}
              onChangeHandler={valueChanger}
              darkMode={darkMode}
            />

            <BirthDate
              errors={errors}
              formData={formData}
              onChangeHandler={valueChanger}
              darkMode={darkMode}
            />

            <Email
              errors={errors}
              formData={formData}
              onChangeHandler={valueChanger}
              darkMode={darkMode}
            />

            <Password
              errors={errors}
              formData={formData}
              onChangeHandler={valueChanger}
              darkMode={darkMode}
            />

            <ConfirmPassword
              errors={errors}
              formData={formData}
              onChangeHandler={valueChanger}
              darkMode={darkMode}
            />

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
      </form>
    </>
  );
};
export default Form;
