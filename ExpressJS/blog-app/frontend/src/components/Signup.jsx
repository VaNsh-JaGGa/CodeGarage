import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Validationform } from "../utils/Validationform";
import { SubmitSign } from "../utils/SubmitSign";
import toast, { Toaster } from "react-hot-toast";

const Signup = () => {
  const navi = useNavigate();
  const [Errors, SetError] = useState({});
  const [form, setform] = useState({
    Name: "",
    Email: "",
    Password: ""
  });

  function SubmitonChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    let newErrors = {};

    setform((prev) => {
      return { ...prev, [name]: value };
    });
    // console.log(form);

    newErrors = Validationform(name, value, {
      ...form,
      [name]: value,
    });

    SetError((prev) => {
      return { ...prev, ...newErrors };
    });
  }

  async function submitButton(e) {
    e.preventDefault();

    const Errors = SubmitSign(form);
    SetError(Errors);

    console.log(Errors);
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
      console.log(response);
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
    }
     catch (error) {
      toast("Server error. Please try again later.", {
        style: { background: "#FFC0C0", color: "#000" },
      });
      console.error(error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <Toaster />
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[rgba(93,64,55,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(249,241,233,0.86))] shadow-[0_18px_60px_rgba(54,32,24,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative overflow-hidden bg-[linear-gradient(165deg,#2f211d_0%,#4a3028_52%,#7f4a34_100%)] px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="relative z-10">
            <p className="mb-5 inline-flex items-center rounded-full bg-[rgba(184,92,56,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#f3d4c5]">Start publishing</p>
            <h1 className="text-4xl font-semibold sm:text-5xl">Create an account and shape your own editorial space.</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/74 sm:text-base">
              The refreshed theme gives your app a more modern blog feel, with softer depth, stronger typography, and calmer forms.
            </p>
          </div>
        </div>

        <form className="flex flex-col gap-5 p-6 sm:p-8 lg:p-10">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[#b85c38]">New account</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#241916]">Signup</h2>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-[#6d5b56]">Name</label>
            <input
              type="text"
              id="name"
              name="Name"
              value={form.Name}
              onChange={(e) => { SubmitonChange(e) }}
              className={`w-full rounded-2xl border bg-white/90 px-4 py-3.5 outline-none transition focus:border-[rgba(184,92,56,0.5)] focus:ring-4 focus:ring-[rgba(184,92,56,0.12)] ${Errors.Name ? "border-red-400 ring-4 ring-red-100" : "border-[rgba(93,64,55,0.12)]"}`}
            />
            {Errors.Name && (
              <span className="text-red-500 text-sm">
                Name is wrong
              </span>)}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-[#6d5b56]">Email</label>
            <input
              type="email"
              id="email"
              name="Email"
              value={form.Email}
              onChange={(e) => { SubmitonChange(e) }}
              className={`w-full rounded-2xl border bg-white/90 px-4 py-3.5 outline-none transition focus:border-[rgba(184,92,56,0.5)] focus:ring-4 focus:ring-[rgba(184,92,56,0.12)] ${Errors.Email ? "border-red-400 ring-4 ring-red-100" : "border-[rgba(93,64,55,0.12)]"}`}
            />
            {Errors.Email && (
              <span className="text-red-500 text-sm">
                Email is wrong
              </span>)}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-[#6d5b56]">Password</label>
            <input
              id="password"
              type="password"
              name="Password"
              value={form.Password}
              onChange={(e) => { SubmitonChange(e) }}
              className={`w-full rounded-2xl border bg-white/90 px-4 py-3.5 outline-none transition focus:border-[rgba(184,92,56,0.5)] focus:ring-4 focus:ring-[rgba(184,92,56,0.12)] ${Errors.Password ? "border-red-400 ring-4 ring-red-100" : "border-[rgba(93,64,55,0.12)]"}`}
            />
            {Errors.Password && (
              <span className="text-red-500 text-sm">
                Password is wrong
              </span>)}
          </div>

          <button onClick={(e) => { submitButton(e) }} className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#b85c38] px-5 py-3 font-semibold text-white shadow-[0_12px_24px_rgba(184,92,56,0.26)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#8e4427]">
            Signup
          </button>

          <p className="text-sm text-[#6d5b56]">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#b85c38]">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
