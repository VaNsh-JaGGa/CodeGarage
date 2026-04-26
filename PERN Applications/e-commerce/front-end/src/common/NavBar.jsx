import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
const Navbar = () => {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
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

                    <div className="flex items-center gap-3">

                        <span className="text-slate-300 text-sm hidden sm:block">{user?.name}</span>

                        <span className={`text-xs px-2 py-1 rounded-full border capitalize
                             ${roleBadgeColor[user?.role]}`}>
                            {user?.role}
                        </span>

                        {user?.role === "buyer" && (
                            <Link to="/cart" className="relative text-slate-300 hover:text-white transition">
                                <span className="text-xl">🛒</span>
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs
                                     w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {cartCount > 9 ? "9+" : cartCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        <button
                            onClick={handleLogout}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20
                         px-3 py-1.5 rounded-lg text-sm font-medium transition"
                        >
                            Logout
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;