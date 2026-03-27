import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Validationform } from "../utils/Validationform"
import { SubmitUtils } from "../utils/submitUtils";
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {

  const [Errors, SetError] = useState({});
  const [form, setform] = useState(
    {
      Email: "",
      Password: ""
    }
  );

  const navi = useNavigate()
  function navigateTo() {
    navi('/signup')
  }

  const HandleOnChange = (e) => {

    let newErrors = {};
    let name = e.target.name;
    let value = e.target.value;

    setform((prev) => {
      return { ...prev, [name]: value }
    });
    
    console.log(name, value);
    newErrors = Validationform(name, value, {
      ...form,
      [name]: value,
    })

    SetError((prev) => {
      return { ...prev, ...newErrors }
    });
    console.log("its me");
    console.log(Errors);
  }

  function submitButton(e) {
    e.preventDefault();
    const newErrors = SubmitUtils(form);
    SetError(newErrors);
    console.log("submitted");

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

    // ----
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const validUser = users.find(
      (user) =>
        user.Email === form.Email &&
        user.Password === form.Password
    );

    if (validUser) {
      localStorage.setItem("currentUser", JSON.stringify(validUser));
      localStorage.setItem("isLoggedIn", "true");
      toast("Login successful", {
        duration: 1500,
        style: {
          background: "#CDFADC",
          color: "black",
        },
      });

      toast.dismiss();
      navi('/home')
      setform({
        Email: "",
        Password: ""
      });

    } else {
      toast("Invalid credentials", {
        style: {
          background: "#FFC0C0",
          color: "#000",
        },
      });
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-[#efefef]">
      <Toaster />

      <form
        className="flex flex-col gap-4 bg-white p-8 m-8 rounded-lg w-[24rem]"
      >

        <h1 className="text-2xl font-bold text-center">Login</h1>

        <div className="flex flex-col relative gap-1">
          <label for="email">Email</label>
          <input
            type="email"
            name="Email"
            id="email"
            placeholder=" "
            className = {`peer border p-2 rounded outline-none transition
            ${Errors.Email
                ? "border-red-500 "
                : "border-[#A5B6CD]"}
            `}
            value={form.Email}
            onChange={(e) => HandleOnChange(e)}
          />

          <label
            for="email"
            className={`absolute left-3 px-1 transition-all pointer-events-none
                ${Errors.Email ? "text-red-500 bg-white" : "text-gray-500 bg-white"}
                floating-label
                `}
          >
            Email <span className="text-red-500">*</span>
          </label>
          {Errors.Email && (
            <span className="text-red-500 text-xs mt-1">
              Email is Wrong
            </span>)}
        </div>

        <div className="flex flex-col relative gap-1">
          <label>Password</label>
          <input
            placeholder=" "
            name="Password"
            type="password"
            className={`
            border peer p-2 rounded outline-none transition
            ${Errors.Password
                ? "border-red-500 "
                : "border-[#A5B6CD]"}
              `}
            value={form.Password}
            onChange={(e) => HandleOnChange(e)}
          />
          <label
            for="password"
            className={`absolute left-3 px-1 transition-all pointer-events-none
                ${Errors.Password ? "text-red-500 bg-white" : "text-gray-500 bg-white"}
                floating-label
                `}
          >
            Password <span className="text-red-500">*</span>
          </label>
          {Errors.Password && (
            <span className="text-red-500 text-xs mt-1">
              Password is Wrong
            </span>)}
        </div>

        <button className="bg-blue-500 text-white p-2 rounded cursor-pointer" onClick={(e) => { submitButton(e) }}>
          Login
        </button>

        <p className="text-sm text-center">
          Don't have an account?{" "}
          <button onClick={navigateTo} className="text-blue-400">
            Sign Up
          </button>
        </p>

      </form>
    </div>
  );
};

export default Login;