
import logo from "../assets/logo.png"

const NavBar = ({ darkMode, setDarkMode }) => {
  return (
    <>
      <div className="flex items-center justify-between bg-[#252F3D] w-full h-[50px] px-4 md:px-10">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`
          absolute p-2 text-sm border rounded transition-all duration-300 lg:top-1.5 left-310
    
          ${darkMode
          ? "bg-black text-white border-white"
          : "bg-yellow-200 text-black border-black"
            }
  `}
        >
          Toggle Dark Mode
        </button>
        <img
          src={logo}
          alt="logo"
          className="h-7 lg:relative lg:left-30 sm:h-7 w-auto invert brightness-0"
        />
      </div>
    </>
  )
}

export default NavBar
