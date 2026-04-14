import { useNavigate } from "react-router-dom"
import { FaPlus } from "react-icons/fa";
import { apiRequest, logoutUser } from "../utils/api";

const RealNavBar = () => {
    const navi = useNavigate();
    const handleLogout = async () => {
        try {
            await apiRequest("/auth/logout", {
                method: "POST",
            });
        } catch {

        } finally {
            logoutUser();
            navi("/", { replace: true });
        }
    };

    return (
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(36,25,22,0.88)] px-6 py-6 text-white shadow-[0_18px_60px_rgba(54,32,24,0.12)] backdrop-blur xl:px-10">
            <div className="absolute -bottom-12 -left-8 h-48 w-48 rounded-full bg-[rgba(243,212,197,0.12)] blur-md" />
            <div className="absolute -right-8 -top-12 h-52 w-52 rounded-full bg-[rgba(184,92,56,0.18)] blur-xl" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                    <p className="mb-4 inline-flex items-center rounded-full bg-[rgba(184,92,56,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#f3d4c5]">Creator dashboard</p>
                    <p className="text-sm uppercase tracking-[0.18em] text-white/60">My recent posts</p>
                    <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Manage your blog with a cleaner editorial view.</h1>
                    <p className="mt-4 max-w-lg text-sm leading-7 text-white/72 sm:text-base">
                        Publish new articles, refine old ones, and keep your content library polished from one place.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RealNavBar
