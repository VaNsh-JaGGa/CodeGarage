import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Validationform } from "../utils/Validationform";
import { SubmitUtils } from "../utils/SubmitUtils";
import toast, { Toaster } from "react-hot-toast";
import { saveLogin } from "../utils/api";

const Login = () => {
  const [Errors, SetError] = useState({});
  const [form, setform] = useState({
    Email: "",
    Password: ""
  });

  const navi = useNavigate();

  function navigateTo() {
    navi("/signup");
  }

  const HandleOnChange = (e) => {
    let newErrors = {};
    const name = e.target.name;
    const value = e.target.value;

    setform((prev) => {
      return { ...prev, [name]: value };
    });

    newErrors = Validationform(name, value, {
      ...form,
      [name]: value,
    });

    SetError((prev) => {
      return { ...prev, ...newErrors };
    });
  };

  async function submitButton(e) {
    e.preventDefault();

    const newErrors = SubmitUtils(form);
    SetError(newErrors);

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

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.Email,
          password: form.Password,
        }),
      });
      console.log("this is response");
      console.log(response);
      const data = await response.json();
      console.log("This is Data");
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      saveLogin(data);
      toast("Login successful", {
        duration: 1500,
        style: {
          background: "#CDFADC",
          color: "black",
        },
      });

      navi("/realhome", { replace: true });
    } catch {
      toast("Invalid Credentals", {
        style: {
          background: "#FFC0C0",
          color: "#000",
        },
      });
    }
  }
                                                                                                                                     
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <Toaster />

      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[rgba(93,64,55,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(249,241,233,0.86))] shadow-[0_18px_60px_rgba(54,32,24,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative overflow-hidden bg-[linear-gradient(165deg,#2f211d_0%,#4a3028_52%,#7f4a34_100%)] px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="relative z-10">
            <p className="mb-5 inline-flex items-center rounded-full bg-[rgba(184,92,56,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#f3d4c5]">Welcome back</p>
            <h1 className="text-4xl font-semibold sm:text-5xl">Sign in to keep writing and curating your next post.</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/74 sm:text-base">
              Your blog dashboard is now wrapped in a warmer editorial theme with cleaner reading rhythm and more polished forms.
            </p>
          </div>
        </div>

        <form className="flex flex-col gap-5 p-6 sm:p-8 lg:p-10">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[#b85c38]">Account access</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#241916]">Login</h2>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-[#6d5b56]">Email</label>
            <input
              type="email"
              name="Email"
              id="email"
              className={`w-full rounded-2xl border bg-white/90 px-4 py-3.5 outline-none transition focus:border-[rgba(184,92,56,0.5)] focus:ring-4 focus:ring-[rgba(184,92,56,0.12)] ${Errors.Email ? "border-red-400 ring-4 ring-red-100" : "border-[rgba(93,64,55,0.12)]"}`}
              value={form.Email}
              onChange={(e) => HandleOnChange(e)}
            />
            {Errors.Email && (
              <span className="text-sm text-red-500">
                Email is wrong
              </span>)}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-[#6d5b56]">Password</label>
            <input
              name="Password"
              id="password"
              type="password"
              className={`w-full rounded-2xl border bg-white/90 px-4 py-3.5 outline-none transition focus:border-[rgba(184,92,56,0.5)] focus:ring-4 focus:ring-[rgba(184,92,56,0.12)] ${Errors.Password ? "border-red-400 ring-4 ring-red-100" : "border-[rgba(93,64,55,0.12)]"}`}
              value={form.Password}
              onChange={(e) => HandleOnChange(e)}
            />
            {Errors.Password && (
              <span className="text-sm text-red-500">
                Password is wrong
              </span>)}
          </div>

          <button className="mt-2 inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[#b85c38] px-5 py-3 font-semibold text-white shadow-[0_12px_24px_rgba(184,92,56,0.26)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#8e4427]" onClick={(e) => { submitButton(e) }}>
            Login
          </button>

          <p className="text-sm text-[#6d5b56]">
            Don&apos;t have an account?{" "}
            <button onClick={navigateTo} className="font-semibold text-[#b85c38]">
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
