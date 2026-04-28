import { useEffect, useState } from "react";
import Navbar from "../common/NavBar";
import { useAuth } from "../context/AuthContext";
import ProductCard from "./ProductCard";

const MyProducts = () => {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchMyProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/products/my-products", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok) {
                setProducts(data.products);
            } else {
                setError(data.message || "Failed to fetch products");
            }
        } catch {
            setError("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyProducts();
    }, [token]);

    const handleDelete = (productId) => {
        setProducts(products.filter((p) => p.id !== productId));
    };

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-white mb-6">My Products</h1>
                
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
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onDelete={handleDelete} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProducts;
