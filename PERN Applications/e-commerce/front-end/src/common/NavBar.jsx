import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
const Navbar = () => {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        console.log("this is user from globalContainer");
        console.log(user);
        if (user?.role !== "buyer") return;

        const fetchCartCount = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/cart", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) setCartCount(data.cartItems?.length || 0);
            } catch { }
        };
        fetchCartCount();

        window.addEventListener("cartUpdated", fetchCartCount);
        return () => window.removeEventListener("cartUpdated", fetchCartCount);
    }, [user, token]);

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:5000/api/auth/logout", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch { }
        logout(); // Call the logout function from context to clear state/localStorage
        toast.success("Logged out successfully!");
        navigate("/");
    };

    const getNavLinks = () => {
        if (user?.role === "admin") return [{ to: "/admin", label: "Dashboard" }];
        if (user?.role === "seller") return [{ to: "/seller", label: "Dashboard" }, { to: "/seller/products", label: "My Products" }];
        return [
            { to: "/home", label: "Shop" },
            { to: "/orders", label: "My Orders" },
        ];
    };

    const roleBadgeColor = {
        admin: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        seller: "bg-green-500/20  text-green-300  border-green-500/30",
        buyer: "bg-blue-500/20   text-blue-300   border-blue-500/30",
    };

    return (
        <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    <Link to="/home" className="flex items-center gap-2">
                        <span className="text-xl">🛒</span>
                        <span className="text-white font-bold text-lg tracking-tight">
                            Shop<span className="text-blue-400">Sphere</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {getNavLinks().map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-slate-300 hover:text-white hover:bg-white/10
                                px-3 py-2 rounded-lg text-sm font-medium transition"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop User Info & Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                            <span className="text-slate-300 text-sm">{user?.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full border capitalize ${roleBadgeColor[user?.role]}`}>
                                {user?.role}
                            </span>
                        </div>

                        {user?.role === "buyer" && (
                            <Link to="/cart" className="relative text-slate-300 hover:text-white transition mt-1">
                                <span className="text-2xl">🛒</span>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px]
                                     w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
                                        {cartCount > 9 ? "9+" : cartCount}
                                    </span>
                                )}
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20
                         px-4 py-1.5 rounded-lg text-sm font-medium transition ml-1"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile View Toggle & Cart */}
                    <div className="flex items-center gap-4 md:hidden">
                        {user?.role === "buyer" && (
                            <Link to="/cart" className="relative text-slate-300 hover:text-white transition">
                                <span className="text-2xl">🛒</span>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px]
                                     w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
                                        {cartCount > 9 ? "9+" : cartCount}
                                    </span>
                                )}
                            </Link>
                        )}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-slate-300 hover:text-white focus:outline-none rounded-lg hover:bg-white/5 transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                )}
                            </svg>
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-slate-800/95 backdrop-blur-md border-t border-white/10 px-4 pt-3 pb-5 space-y-3 shadow-xl">
                    <div className="flex flex-col gap-2">
                        {getNavLinks().map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-slate-300 hover:text-white hover:bg-white/10
                                px-4 py-3 rounded-xl text-base font-medium transition"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    
                    <div className="border-t border-white/10 mt-4 pt-4">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <span className="text-slate-300 font-medium">{user?.name}</span>
                            <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${roleBadgeColor[user?.role]}`}>
                                {user?.role}
                            </span>
                        </div>
                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                handleLogout();
                            }}
                            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20
                         px-4 py-3 rounded-xl text-sm font-bold transition text-center"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;