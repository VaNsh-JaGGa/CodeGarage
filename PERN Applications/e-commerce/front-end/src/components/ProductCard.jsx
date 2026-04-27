import { useState } from "react";
import { useAuth } from "../context/AuthContext";

// product = { id, name, description, price, stock, image_url, seller }
const ProductCard = ({ product }) => {
    const { token } = useAuth();              // api call ke liye token chahiye
    const [added, setAdded] = useState(false);  // show deffierent text on button and button ko disable krdeta h 2 sec k lie settimeoout ki vajah se.
    const [addingToCart, setAddingToCart] = useState(false);

    // add to card function h
    const handleAddToCart = async () => {
        setAddingToCart(true);            
        try {
            const response = await fetch("http://localhost:5000/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId: product.id, quantity: 1 }), // Add 1 item
            });

            if (response.ok) {
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
            }
            }
        catch (err) {
            console.error("Add to cart error:", err);
        } finally {
            setAddingToCart(false);
        }
    };

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
                        📦
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
                        ₹{parseFloat(product.price).toFixed(2)} 
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full border
                    ${product.stock > 0
                    ? "text-green-400 bg-green-500/10 border-green-500/20"  
                    : "text-red-400 bg-red-500/10 border-red-500/20"        
                        }`}>
                        {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
                    </span>
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || addingToCart || added} // Disabled when out of stock
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition duration-200
                            ${added
                            ? "bg-green-600 text-white"               
                            : product.stock === 0
                                ? "bg-slate-700 text-slate-500 cursor-not-allowed" 
                                : "bg-blue-600 hover:bg-blue-500 text-white"
                        }`}
                >
                    {added ? "✓ Added to Cart" : addingToCart ? "Adding..." : "Add to Cart"}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;