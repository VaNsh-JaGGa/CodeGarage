import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../common/NavBar";

const SellerDashboard = () => {
    const { token, user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        image_url: "",
    });
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newProduct),
            });
            const data = await response.json();

            if (!response.ok) {
                setFormError(data.message || "Failed to add product");
                return;
            }

            setNewProduct({ name: "", description: "", price: "", stock: "", image_url: "" });
            setShowForm(false);
            alert("Product Added Successfully!");
        } catch {
            setFormError("Server error");
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Seller Dashboard</h1>
                        <p className="text-slate-400 text-sm mt-1">Welcome, {user?.name}</p>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5
                       rounded-xl text-sm font-semibold transition"
                    >
                        {showForm ? "✕ Cancel" : "+ Add Product"}
                    </button>
                </div>

                {showForm ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                        <h2 className="text-white font-semibold mb-4">New Product</h2>

                        {formError && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400
                              text-sm rounded-lg px-4 py-3 mb-4">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-slate-300 text-sm block mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    placeholder="e.g. Running Shoes"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500
                                    rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>

                            <div>
                                <label className="text-slate-300 text-sm block mb-1">Price (₹) *</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                    placeholder="e.g. 999.00"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500
                                    rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>

                            <div>
                                <label className="text-slate-300 text-sm block mb-1">Stock Quantity *</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={newProduct.stock}
                                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                    placeholder="e.g. 50"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500
                                    rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>

                            <div>
                                <label className="text-slate-300 text-sm block mb-1">Image URL (optional)</label>
                                <input
                                    type="url"
                                    value={newProduct.image_url}
                                    onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500
                                    rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-slate-300 text-sm block mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    placeholder="Describe your product..."
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500
                                    rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500
                                    transition resize-none"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white
                                    font-semibold px-6 py-2.5 rounded-xl text-sm transition"
                                >
                                    {formLoading ? "Adding..." : "Add Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-slate-400">
                        <p className="text-4xl mb-3">🏪</p>
                        <p className="text-lg font-medium">Welcome to your dashboard!</p>
                        <p className="text-sm mt-1">Click "+ Add Product" to create a new product listing, or navigate to "My Products" to view and manage your inventory.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;