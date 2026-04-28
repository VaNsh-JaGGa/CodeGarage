import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../common/NavBar";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:5000/api";

const OrdersPage = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/order`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load orders");
        }
        console.log("getorder Response");
        console.log(data);
        setOrders(data.orders || []);
      } catch (err) {
        toast.error(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const statusStyle = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    shipped: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    delivered: "bg-green-500/10 text-green-400 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const formatDate = (dateValue) =>
    new Date(dateValue).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">My Orders</h1>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center text-slate-400 py-20">
            <p className="text-lg font-medium">No orders yet</p>
            <p className="text-sm mt-1">Your placed orders will appear here.</p>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition"
                >
                  <div>
                    <p className="text-white font-semibold">Order #{order.id}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full border capitalize ${
                      statusStyle[order.status] || statusStyle.pending
                    }`}
                  >
                    {order.status}
                  </span>

                  <div className="text-right">
                    <p className="text-white font-bold">
                      Rs. {parseFloat(order.totalPrice || 0).toFixed(2)}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;