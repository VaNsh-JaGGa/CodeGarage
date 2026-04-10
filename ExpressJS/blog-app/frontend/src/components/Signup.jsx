import { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { Validationform } from '../utils/Validationform';
import {SubmitSign} from '../utils/SubmitSign'
import toast, { Toaster } from 'react-hot-toast';
const Signup = () => {
  const navi = useNavigate();
  const [Errors, SetError] = useState({});
  const [form, setform] = useState({
    Name: "",
    Email: "",
    Password: ""
  });

  function SubmitonChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    let newErrors = {};

    setform((prev) => {
      return { ...prev, [name]: value }
    });

    newErrors = Validationform(name, value, {
      ...form,
      [name]: value,
    })

    SetError((prev) => {
      return { ...prev, ...newErrors }
    });
  }

  async function submitButton(e) {
    e.preventDefault();

    const Errors = SubmitSign(form);
    SetError(Errors);
    
    if (Object.keys(Errors).length > 0) {
      toast("There was an error creating the account", {
        style: {
          background: "#FFC0C0",
          color: "#000",
          border: "1px solid #FF6B6B",
        },
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.Name,
          email: form.Email,
          password: form.Password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast(data.message || "Signup failed", {
          style: { background: "#FFC0C0", color: "#000" },
        });
        return;
      }

      toast("Account Created Successfully", {
        style: {
          background: "#CDFADC",
          color: "black",
          border: "1px solid #CDFADC",
          borderRadius: "10px",
        },
      });

      navi("/");
    } catch (error) {
      toast("Server error. Please try again later.", {
        style: { background: "#FFC0C0", color: "#000" },
      });
      console.error(error);
    }
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-[#efefef]">
        <Toaster />
        <form
          className="flex flex-col gap-4 bg-white p-8 m-8 rounded-lg w-[24rem]"
        >

          <h1 className="text-2xl font-bold text-center">Signup</h1>

          <div className="flex flex-col relative gap-1">
            <label>Name</label>
            <input
              type="text"
              placeholder=" "
              name="Name"
              value={form.Name}
              onChange={(e) => { SubmitonChange(e) }}
              className={`peer border p-2 rounded outline-none transition border-[#A5B6CD]
                  ${Errors.Name
                  ? "border-red-500 "
                  : "border-[#A5B6CD]"}
                `}
            />
            <label
              className={`absolute left-3 px-1 transition-all pointer-events-none
                ${Errors.Email ? "text-red-500 bg-white" : "text-gray-500 bg-white"}
                floating-label
                `}
            >
              Enter Name<span className="text-red-500">*</span>
            </label>
            {Errors.Name && (
              <span className="text-red-500 text-xs mt-1">
                Name is Wrong
              </span>)}
          </div>


          <div className="flex flex-col relative gap-1">
            <label>Email</label>
            <input
              type="email"
              placeholder=" "
              name="Email"
              value={form.Email}
              onChange={(e) => { SubmitonChange(e) }}
              className={`peer border p-2 rounded outline-none transition
              ${Errors.Email ? "border-red-500" : "border-[#A5B6CD]"}
              `}
            />
            <label
              for="email"
              className={`absolute left-3 px-1 transition-all pointer-events-none
                ${Errors.Email ? "text-red-500 bg-white" : "text-gray-500 bg-white"}
                floating-label
                `}
            >
              Enter Email<span className="text-red-500">*</span>
            </label>
            {Errors.Email && (
              <span className="text-red-500 text-xs mt-1">
                Email is Wrong
              </span>)}
          </div>


          <div className="flex flex-col relative gap-1">
            <label>Password</label>
            <input
              type="password"
              placeholder=" "
              name="Password"
              value={form.Password}
              onChange={(e) => { SubmitonChange(e) }}
              className={`peer border p-2 rounded outline-none transition
              ${Errors.Password ? "border-red-500" : "border-[#A5B6CD]"}
              `}
            />
            <label
              for="email"
              className={`absolute left-3 px-1 transition-all pointer-events-none
                ${Errors.Password ? "text-red-500 bg-white" : "text-gray-500 bg-white"}
                floating-label
                `}
            >
              Enter Password<span className="text-red-500">*</span>
            </label>
            {Errors.Password && (
              <span className="text-red-500 text-xs mt-1">
                Password is Wrong
              </span>)}
          </div>

          <button onClick={(e)=>{submitButton(e)}} className="bg-blue-500 text-white p-2 rounded">
            Signup
          </button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </form>
      </div>
    </>
  )
}

export default Signup
