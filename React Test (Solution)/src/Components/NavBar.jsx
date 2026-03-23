
import logo from "../assets/logo.png"

const NavBar = () => {
  return (
    <>
      <div className="flex items-center justify-between bg-[#252F3D] w-full h-[50px] px-4 md:px-10">

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
