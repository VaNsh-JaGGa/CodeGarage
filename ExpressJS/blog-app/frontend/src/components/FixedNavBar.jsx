import { useNavigate, Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { apiRequest, logoutUser } from "../utils/api";
import logo from "../assets/logo.png";

const FixedNavBar = () => {
  const navi = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleLogout = async () => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });
    } catch {
      console.log("mat kar bhai");
    } finally {
      logoutUser();
      navi("/", { replace: true });
    }
  };

  return (
    <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(36,25,22,0.88)] px-4 py-5 text-white shadow-[0_18px_60px_rgba(54,32,24,0.12)] backdrop-blur sm:px-6 lg:px-8">
      <div className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-[rgba(243,212,197,0.12)] blur-md sm:h-48 sm:w-48" />
      <div className="absolute -right-8 -top-12 h-44 w-44 rounded-full bg-[rgba(184,92,56,0.18)] blur-xl sm:h-52 sm:w-52" />

      <div className="relative z-10 flex flex-col gap-5 md:flex-row md:justify-between">
        {/* Logo — clicking goes to correct home depending on auth state */}
        <button
          type="button"
          onClick={() => navi(isLoggedIn ? "/realhome" : "/")}
          className="flex w-full items-center justify-center gap-3 rounded-[1.5rem] text-left transition hover:opacity-90 md:w-auto md:justify-start"
        >
          <img
            src={logo}
            alt="Blog dashboard logo"
            className="h-20 w-20 rounded-2xl bg-white/10 p-2 object-contain sm:h-14 sm:w-14"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/60">
              {isLoggedIn ? "Dashboard" : "Blog"}
            </p>
            <p className="text-lg font-semibold text-white sm:text-xl">
              {isLoggedIn ? "Blog Dashboard" : "Blog Home"}
            </p>
          </div>
        </button>

        <div className="flex w-full flex-col gap-3 sm:flex-col md:w-auto md:flex-row">
          {isLoggedIn ? (
            <>
              {/* Logged-in: Add Blog + Logout */}
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white transition duration-200 hover:bg-white hover:text-[#241916] sm:w-auto"
                onClick={() => navi("/addblog")}
              >
                <FaPlus /> Add Blog
              </button>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#b85c38] px-5 py-3 font-semibold text-white shadow-[0_12px_24px_rgba(184,92,56,0.26)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#8e4427] sm:w-auto"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Guest: Login + Signup */}
              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white transition duration-200 hover:bg-white hover:text-[#241916] sm:w-auto"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#b85c38] px-5 py-3 font-semibold text-white shadow-[0_12px_24px_rgba(184,92,56,0.26)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#8e4427] sm:w-auto"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default FixedNavBar;