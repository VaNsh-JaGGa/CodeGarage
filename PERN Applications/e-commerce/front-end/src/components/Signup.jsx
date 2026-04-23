import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateField, validateSignupForm } from "../utils/validation";
import toast, { Toaster } from 'react-hot-toast';

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    const error = validateField(name, value);
    setFieldErrors({
      ...fieldErrors,
      [name]: error,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const errors = validateSignupForm(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    console.log("Submit Button Clicked");
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(formData)
      });
      
      const data = await response.json();
      console.log("This is Response", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to SignUp");
      }
      toast.success("Account Created Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/"); // Redirect to login page on success
    }
    catch (err) {
      toast("Something Went Wrong, Hire a Developer");
      setError(err.message || "An error occurred");
    }
    finally {
      setLoading(false);
    }
  };
 
return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
    <Toaster/>
    <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl px-8 py-4">

      <div className="text-center mb-8">

        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500 rounded-xl mb-4 shadow-lg shadow-blue-500/30">
          <span className="text-2xl">🛒</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
        <p className="text-slate-400 mt-1 text-sm">Join ShopSphere today</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={`w-full bg-white/5 border ${fieldErrors.name ? 'border-red-500' : 'border-white/10'} text-white placeholder-slate-500
            rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500
            focus:ring-1 focus:ring-blue-500 transition`}
          />
          {fieldErrors.name && <p className="text-red-400 text-xs mt-1.5">{fieldErrors.name}</p>}
        </div>

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={`w-full bg-white/5 border ${fieldErrors.email ? 'border-red-500' : 'border-white/10'} text-white placeholder-slate-500
                         rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500
                         focus:ring-1 focus:ring-blue-500 transition`}
          />
          {fieldErrors.email && <p className="text-red-400 text-xs mt-1.5">{fieldErrors.email}</p>}
        </div>

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 8 characters"
              className={`w-full bg-white/5 border ${fieldErrors.password ? 'border-red-500' : 'border-white/10'} text-white placeholder-slate-500
                           rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500
                           focus:ring-1 focus:ring-blue-500 transition`}
            />
            <button
              type="button"
              onClick={() => setPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          {fieldErrors.password && <p className="text-red-400 text-xs mt-1.5">{fieldErrors.password}</p>}
        </div>

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1.5">
            Role
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="buyer"
            className={`w-full bg-white/5 border ${fieldErrors.role ? 'border-red-500' : 'border-white/10'} text-white placeholder-slate-500
              rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500
              focus:ring-1 focus:ring-blue-500 transition`}
          />
          {fieldErrors.role && <p className="text-red-400 text-xs mt-1.5">{fieldErrors.role}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800
          disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl
          transition duration-200 shadow-lg shadow-blue-600/20 mt-2"
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>

      </form>
      <p className="text-center text-slate-400 text-sm mt-6">
        Already Registered ?{" "}
        <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium transition">
          Login
        </Link>
      </p>
    </div>
  </div>
);
};

export default SignupPage;