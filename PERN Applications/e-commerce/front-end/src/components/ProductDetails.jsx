import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../common/NavBar";
import { useAuth } from "../context/AuthContext";

const ProductDetails = () => {
    const { id } = useParams();
    const { token, user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [added, setAdded] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "Failed to load product");
                    return;
                }

                setProduct(data.product);
            } catch (err) {
                setError("Cannot reach server");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, token]);

    const handleAddToCart = async () => {
        if (!product) return;

        setAddingToCart(true);
        try {
            const response = await fetch("http://localhost:5000/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId: product.id, quantity: 1 }),
            });

            if (response.ok) {
                setAdded(true);
                window.dispatchEvent(new Event("cartUpdated"));
                toast.success("Added to cart");
                setTimeout(() => setAdded(false), 2000);
            } else {
                const data = await response.json();
                toast.error(data.message || "Failed to add to cart");
            }
        } catch (err) {
            console.error("Add to cart error:", err);
            toast.error("Failed to add to cart");
        } finally {
            setAddingToCart(false);
        }
    };

    const handleDeleteProduct = async () => {
        if (!product) return;
        if (!window.confirm("Delete this product?")) return;

        setDeleting(true);
        try {
            const response = await fetch(`http://localhost:5000/api/products/${product.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete product");
            }

            toast.success("Product deleted successfully");
            window.history.back();
        } catch (err) {
            console.error("Delete product error:", err);
            toast.error(err.message || "Failed to delete product");
        } finally {
            setDeleting(false);
        }
    };

    const canDelete = user?.role === "admin" || user?.role === "seller";

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {error && !loading && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-center">
                        {error}
                    </div>
                )}

                {!loading && !error && product && (
                    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="bg-slate-900/60 min-h-[320px] md:min-h-[520px]">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-3xl font-semibold">
                                        No Image
                                    </div>
                                )}
                            </div>

                            <div className="p-6 md:p-8 flex flex-col">
                                <p className="text-sm text-slate-400 mb-2">
                                    Seller: {product.seller?.name || "Unknown Seller"}
                                </p>

                                <h1 className="text-3xl font-bold text-white mb-4">
                                    {product.name}
                                </h1>

                                <p className="text-blue-400 text-3xl font-bold mb-4">
                                    Rs.{parseFloat(product.price).toFixed(2)}
                                </p>

                                <div className="mb-6">
                                    <span className={`inline-flex text-sm px-3 py-1 rounded-full border
                                        ${product.stock > 0
                                            ? "text-green-400 bg-green-500/10 border-green-500/20"
                                            : "text-red-400 bg-red-500/10 border-red-500/20"
                                        }`}>
                                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                                    </span>
                                </div>

                                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-4 mb-6">
                                    <h2 className="text-white font-semibold mb-2">Description</h2>
                                    <p className="text-slate-300 leading-7">
                                        {product.description || "No description available for this product."}
                                    </p>
                                </div>

                                <div className="mt-auto">
                                    {canDelete ? (
                                        <button
                                            onClick={handleDeleteProduct}
                                            disabled={deleting}
                                            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold transition duration-200 bg-red-600 hover:bg-red-500 text-white disabled:bg-red-800 disabled:cursor-not-allowed"
                                        >
                                            {deleting ? "Deleting..." : "Delete Product"}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={product.stock === 0 || addingToCart || added}
                                            className={`w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold transition duration-200
                                                ${added
                                                    ? "bg-green-600 text-white"
                                                    : product.stock === 0
                                                        ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                                                        : "bg-blue-600 hover:bg-blue-500 text-white"
                                                }`}
                                        >
                                            {added ? "Added to Cart" : addingToCart ? "Adding..." : "Add to Cart"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
