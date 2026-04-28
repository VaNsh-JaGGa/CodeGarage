import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../common/NavBar";

const AdminDashboard = () => {
    const { token } = useAuth();

    const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("users");

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}` };
                const [statsRes, usersRes, ordersRes] = await Promise.all([
                    fetch("http://localhost:5000/api/admin/stats", { headers }), // return the count of the user , product , and Order
                    fetch("http://localhost:5000/api/admin/users", { headers }), // return all the users
                    fetch("http://localhost:5000/api/admin/orders", { headers }),// return the details of order table and )( JOIN with User and User JOIN with OrderItem ).
                ]);
                const [statsData, usersData, ordersData] = await Promise.all([
                    statsRes.json(), usersRes.json(), ordersRes.json(),
                ]);
                if (statsRes.ok) setStats(statsData);
                if (usersRes.ok) setUsers(usersData.users);
                if (ordersRes.ok) setOrders(ordersData.orders);
            } catch {
                setError("Failed to load admin data");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [token]);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Delete this user? This cannot be undone.")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setUsers(users.filter((u) => u.id !== userId));
                setStats((s) => ({ ...s, users: s.users - 1 }));
            }
        } catch { alert("Failed to delete user"); }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setOrders(orders.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
            }
        } catch { alert("Failed to update status"); }
    };

    const roleBadge = (role) => {
        const styles = {
            admin: "bg-purple-500/20 text-purple-300 border-purple-500/30",
            seller: "bg-green-500/20  text-green-300  border-green-500/30",
            buyer: "bg-blue-500/20   text-blue-300   border-blue-500/30",
        };
        return (
            <span className={`text-xs px-2 py-1 rounded-full border capitalize ${styles[role]}`}>
                {role}
            </span>
        );
    };

    const statusColor = {
        pending: "text-yellow-400",
        processing: "text-blue-400",
        shipped: "text-purple-400",
        delivered: "text-green-400",
        cancelled: "text-red-400",
    };

    const StatCard = ({ label, value, emoji, color }) => (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-3xl mb-2">{emoji}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-slate-400 text-sm mt-1">{label}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-slate-400 text-sm mt-1">Platform-wide management</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <StatCard label="Total Users" value={stats.users} emoji="👥" color="text-blue-400" />
                    <StatCard label="Total Products" value={stats.products} emoji="📦" color="text-green-400" />
                    <StatCard label="Total Orders" value={stats.orders} emoji="🧾" color="text-purple-400" />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {["users", "orders"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition
                ${activeTab === tab
                                    ? "bg-blue-600 text-white"
                                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"}`}
                        >
                            {tab} ({tab === "users" ? stats.users : stats.orders})
                        </button>
                    ))}
                </div>

                {loading && (
                    <div className="flex justify-center py-16">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {error && <p className="text-red-400 text-center py-6">{error}</p>}

                {/* Users Table */}
                {!loading && activeTab === "users" && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 text-left">
                                    <th className="px-6 py-4 font-medium">ID</th>
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Email</th>
                                    <th className="px-6 py-4 font-medium">Role</th>
                                    <th className="px-6 py-4 font-medium">Joined</th>
                                    <th className="px-6 py-4 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                        <td className="px-6 py-4 text-slate-500">#{u.id}</td>
                                        <td className="px-6 py-4 text-white font-medium">{u.name}</td>
                                        <td className="px-6 py-4 text-slate-300">{u.email}</td>
                                        <td className="px-6 py-4">{roleBadge(u.role)}</td>
                                        <td className="px-6 py-4 text-slate-400 text-xs">
                                            {new Date(u.createdAt).toLocaleDateString("en-IN")}
                                        </td>
                                        <td className="px-6 py-4">
                                            {u.role !== "admin" && (
                                                <button
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    className="text-red-400 hover:text-red-300 text-xs border border-red-500/20
                                     hover:border-red-500/40 px-3 py-1 rounded-lg transition"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Orders Table */}
                {!loading && activeTab === "orders" && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-x-auto">
                        <table className="w-full text-sm min-w-[640px]">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 text-left">
                                    <th className="px-6 py-4 font-medium">Order</th>
                                    <th className="px-6 py-4 font-medium">Buyer</th>
                                    <th className="px-6 py-4 font-medium">Total</th>
                                    <th className="px-6 py-4 font-medium">Items</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                        <td className="px-6 py-4 text-slate-500">#{order.id}</td>
                                        <td className="px-6 py-4">
                                            <p className="text-white">{order.buyer?.name}</p>
                                            <p className="text-slate-500 text-xs">{order.buyer?.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-blue-400 font-semibold">
                                            Rs.{parseFloat(order.totalPrice).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-xs">
                                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`bg-slate-800 border border-white/10 rounded-lg px-2 py-1
                                   text-xs font-semibold capitalize focus:outline-none
                                   cursor-pointer transition ${statusColor[order.status]}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {orders.length === 0 && (
                            <p className="text-center text-slate-400 py-10">No orders yet</p>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;