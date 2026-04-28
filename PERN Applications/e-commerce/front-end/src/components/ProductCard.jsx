import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

// product = { id, name, description, price, stock, image_url, seller }
const ProductCard = ({ product, onDelete }) => {
    const { token, user } = useAuth();
    const [added, setAdded] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleAddToCart = async () => {
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
                setTimeout(() => setAdded(false), 2000);
            }
        } catch (err) {
            console.error("Add to cart error:", err);
        } finally {
            setAddingToCart(false);
        }
    };

    const handleDeleteProduct = async () => {
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
            onDelete?.(product.id);
        } catch (err) {
            console.error("Delete product error:", err);
            toast.error(err.message || "Failed to delete product");
        } finally {
            setDeleting(false);
        }
    };

    const canDelete = user?.role === "admin" || user?.role === "seller";

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden
        hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10
        transition duration-300 group flex flex-col">

            <div className="aspect-square bg-slate-800 overflow-hidden">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl text-slate-600">
                        Product
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1">

                <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-1">
                    {product.name}
                </h3>

                <p className="text-slate-500 text-xs mb-3">
                    by {product.seller?.name || "Unknown Seller"}
                </p>

                <div className="flex items-center justify-between mb-4 mt-auto">
                    <span className="text-blue-400 font-bold text-lg">
                        Rs.{parseFloat(product.price).toFixed(2)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full border
                    ${product.stock > 0
                    ? "text-green-400 bg-green-500/10 border-green-500/20"
                    : "text-red-400 bg-red-500/10 border-red-500/20"
                        }`}>
                        {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
                    </span>
                </div>

                {canDelete ? (
                    <button
                        onClick={handleDeleteProduct}
                        disabled={deleting}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold transition duration-200 bg-red-600 hover:bg-red-500 text-white disabled:bg-red-800 disabled:cursor-not-allowed"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                ) : (
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || addingToCart || added}
                        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition duration-200
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
    );
};

export default ProductCard;
