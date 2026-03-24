import logo from "../assets/logo.png";

const NavBar = ({ darkMode, setDarkMode }) => {
  return (
    <div className="
      flex items-center justify-between
      w-full h-[50px]
      px-3 sm:px-4 md:px-10
      bg-[#252F3D]
    ">

      {/* Logo */}
      <img
        src={logo}
        alt="logo"
        className="h-6 sm:h-7 w-auto invert brightness-0"
      />

      {/* Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`
          p-1.5 sm:p-2
          text-xs sm:text-sm md:text-base
          border rounded transition-all duration-300

          ${darkMode
            ? "bg-black text-white border-white"
            : "bg-yellow-200 text-black border-black"}
        `}
      >
        Toggle
      </button>

    </div>
  );
};

export default NavBar;