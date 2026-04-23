import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword,setPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        console.log("submit button clicked");
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            console.log("response mil gaya");
            console.log(response);

            const data = await response.json();
            console.log("converted the response to the json");
            console.log(data);

            if (!response.ok) {
                setError(data.message || "Login failed");
                setLoading(false);
                return;
            }

            login(data.user, data.token); // saving the data globally

            if (data.user.role === "admin") navigate("/admin");
            else if (data.user.role === "seller") navigate("/seller");
            else navigate("/home");

        } catch (err) {
            console.error("Login Error:", err);
            setError("Cannot connect to server. Is the backend running?");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500 rounded-xl mb-4 shadow-lg shadow-blue-500/30">
                        <span className="text-2xl">🛒</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
                    <p className="text-slate-400 mt-1 text-sm">Sign in to your ShopSphere account</p>
                </div>

                {console.log("error in the starting")}
                {console.log(error)}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
                        {error}
                    </div>
                )}
            
                <form onSubmit={handleSubmit} className="space-y-5">
            
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
                            className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500
                            rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500
                            focus:ring-1 focus:ring-blue-500 transition"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-slate-300 text-sm font-medium">Password</label>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Your password"
                                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500
                                rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-blue-500
                                focus:ring-1 focus:ring-blue-500 transition"
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
                    </div>
   
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800
                        disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl
                        transition duration-200 shadow-lg shadow-blue-600/20 mt-2"
                    >
                        {loading ? "Signing in…" : "Sign In"}
                    </button>
                </form>
                    
                <p className="text-center text-slate-400 text-sm mt-6">
                    New here?{" "}
                    <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition">
                        Create an account
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default LoginPage;