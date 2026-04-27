import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../common/NavBar";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:5000/api";

const CartPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState("0.00");
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  const fetchCart = async () => {
    if (!token) return;

    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load cart");
    }

    setCartItems(data.cartItems || []);
    setTotalPrice(data.totalPrice || "0.00");
  };

  useEffect(() => {
    const loadCart = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await fetchCart();
      } catch (err) {
        toast.error(err.message || "Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [token]);

  const handleUpdateQty = async (itemId, newQty) => {
    if (newQty < 1) return;

    try {
      const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQty }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update quantity");
      }

      await fetchCart();
    } catch (err) {
      toast.error(err.message || "Failed to update quantity");
    }
  };

  const handleRemove = async (itemId, itemName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove item");
      }

      toast.success(`"${itemName}" removed from cart`);
      await fetchCart();
    } catch (err) {
      toast.error(err.message || "Failed to remove item");
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);

    try {
      const response = await fetch(`${API_BASE_URL}/order`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Checkout failed");
      }

      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      toast.error(err.message || "Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Your Cart</h1>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && cartItems.length === 0 && (
          <div className="text-center text-slate-400 py-20">
            <p className="text-lg font-medium">Your cart is empty</p>
            <button
              onClick={() => navigate("/home")}
              className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition"
            >
              Start Shopping
            </button>
          </div>
        )}

        {!loading && cartItems.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 items-center"
                >
                  <div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0">
                    {item.product?.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {item.product?.name || "Unknown Product"}
                    </p>
                    <p className="text-blue-400 text-sm font-semibold mt-0.5">
                      Rs. {parseFloat(item.product?.price || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-white font-semibold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-slate-300 text-sm font-medium w-24 text-right">
                    Rs. {(parseFloat(item.product?.price || 0) * item.quantity).toFixed(2)}
                  </p>

                  <button
                    onClick={() => handleRemove(item.id, item.product?.name)}
                    className="text-red-400 hover:text-red-300 transition text-xl ml-1 leading-none"
                    title="Remove"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:w-72">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-20">
                <h2 className="text-white font-semibold text-lg mb-4">Order Summary</h2>

                <div className="flex justify-between text-slate-400 text-sm mb-2">
                  <span>{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</span>
                  <span>Rs. {totalPrice}</span>
                </div>

                <div className="border-t border-white/10 my-4" />

                <div className="flex justify-between text-white font-bold text-lg mb-6">
                  <span>Total</span>
                  <span>Rs. {totalPrice}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition"
                >
                  {checkingOut ? "Placing Order..." : "Place Order"}
                </button>

                <button
                  onClick={() => navigate("/home")}
                  className="w-full mt-3 text-slate-400 hover:text-white text-sm transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
