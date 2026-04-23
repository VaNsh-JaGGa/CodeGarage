import { useNavigate } from "react-router-dom"

const NavBar = () => {
const navi = useNavigate();
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(36,25,22,0.88)] px-6 py-6 text-white shadow-[0_18px_60px_rgba(54,32,24,0.12)] backdrop-blur xl:px-10">
      <div className="absolute -bottom-12 -left-8 h-48 w-48 rounded-full bg-[rgba(243,212,197,0.12)] blur-md" />
      <div className="absolute -right-8 -top-12 h-52 w-52 rounded-full bg-[rgba(184,92,56,0.18)] blur-xl" />
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="mb-4 inline-flex items-center rounded-full bg-[rgba(184,92,56,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#f3d4c5]">Daily stories</p>
          <h1 className="text-4xl font-semibold sm:text-5xl">Stories, ideas, and quiet corners of the internet.</h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-white/72 sm:text-base">
            Discover thoughtful posts, fresh perspectives, and clean reading spaces made for modern blog publishing.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white transition duration-200 hover:bg-white hover:text-[#241916] sm:w-auto"
            onClick={() => {
              navi("/login");
            }}
          >
            Login
          </button>
          <button
            className="inline-flex w-full items-center justify-center rounded-full bg-[#b85c38] px-5 py-3 font-semibold text-white shadow-[0_12px_24px_rgba(184,92,56,0.26)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#8e4427] sm:w-auto"
            onClick={() => {
              navi("/signup");
            }}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  )
}

export default NavBar
