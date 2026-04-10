import { useNavigate } from "react-router-dom"

const NavBar = () => {
const navi = useNavigate();
  return (
    <>
          <div className=" flex flex-col gap-[2.5rem] sm:flex-row sm:justify-between  sm:gap-[1rem] relative mb-25 bg-[#1C1010] px-10 py-5">

              <div className="text-center">
                  <h1 className="text-4xl font-bold text-white">Blogs</h1>
              </div>

              <div className="flex flex-col gap-8 sm:flex-row sm:gap-15">
                  <button
                      className=" flex justify-center items-center gap-4 text-white px-6 py-2 rounded text-xl font-bold cursor-pointer border-2 border-white sm:border-none hover:bg-white hover:text-blue-600 
                      transition-all duration-300 ease-in-out"
                      onClick={() => {
                          navi("/login");
                      }}
                  >
                      Login
                  </button>
                  <button
                      className=" text-white px-6 py-2 rounded text-xl font-bold cursor-pointer border-2 border-white sm:border-none hover:bg-white hover:text-blue-600 
                      transition-all duration-300 ease-in-out"
                      onClick={() => {
                          localStorage.removeItem("isLoggedIn");
                          localStorage.removeItem("currentUser");
                          navi("/signup");
                      }}
                  >
                      Signup
                  </button>

              </div>

          </div>
    </>
  )
}

export default NavBar
