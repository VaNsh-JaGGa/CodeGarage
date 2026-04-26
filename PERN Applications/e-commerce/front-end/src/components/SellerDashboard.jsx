// ye component sare products show krega or add krne ke lie functionality provide krega.
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../common/NavBar";

const SellerDashboard = () => {
    const { token, user } = useAuth();           // Token le aao api call ke lie and user for name
    const [products, setProducts] = useState([]); // Seller's own products
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false); // toggle and show form

    // New Product ki state
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        image_url: "",
    });
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    //fetch karo products ko
    const fetchMyProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/products/my-products", {
                headers: { Authorization: `Bearer ${token}` }, // Auth header
            });
            const data = await response.json();
            if (response.ok) setProducts(data.products);
            else setError(data.message);
        } catch {
            setError("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyProducts();
    }, []);

    // Add new Product Function --- db me store krega api call karke
    const handleAddProduct = async (e) => {
        e.preventDefault(); // Prevent page reload
        setFormError("");
        setFormLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newProduct), // Send form data
            });
            const data = await response.json();

            if (!response.ok) {
                setFormError(data.message || "Failed to add product");
                return;
            }
            { showform ? "Cancel" : "Add Product" }
    
            fetchMyProducts();
            setNewProduct({ name: "", description: "", price: "", stock: "", image_url: "" });
            setShowForm(false); // Hide the form
        } catch {
            setFormError("Server error");
        } finally {
            setFormLoading(false);
        }
    };

    //delete product function 
    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                // remove from the localStorage
                setProducts(products.filter((p) => p.id !== productId));
            }
        } catch {
            alert("Failed to delete");
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

                {showForm && (
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
                )}

                {/* products table --- basicallly products ko show karta hai  */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-center">
                        {error}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center text-slate-400 py-20">
                        <p className="text-4xl mb-3">📦</p>
                        <p className="text-lg font-medium">No products yet</p>
                        <p className="text-sm mt-1">Click "+ Add Product" to get started</p>
                    </div>
                ) : (
                    //tablee
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400">
                                    <th className="text-left px-6 py-4 font-medium">Product</th>
                                    <th className="text-left px-6 py-4 font-medium">Price</th>
                                    <th className="text-left px-6 py-4 font-medium">Stock</th>
                                    <th className="text-left px-6 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                        <td className="px-6 py-4 text-white font-medium">{product.name}</td>
                                        <td className="px-6 py-4 text-blue-400">₹{parseFloat(product.price).toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs border
                                                    ${product.stock > 0
                                                    ? "text-green-400 bg-green-500/10 border-green-500/20"
                                                    : "text-red-400 bg-red-500/10 border-red-500/20"
                                            }`}>
                                                {product.stock} units
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-red-400 hover:text-red-300 text-xs border border-red-500/20
                                                hover:border-red-500/40 px-3 py-1 rounded-lg transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;