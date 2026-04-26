// shopping page for buyers.
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../common/NavBar";
import toast from 'react-hot-toast';
import ProductCard from "./ProductCard";

const HomePage = () => {
  const { token } = useAuth(); // token le aao global container se api request ke liye.
  const [products, setProducts] = useState([]); // api se jo products aayengi unko store krege.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");      // search input ko store krege.

  useEffect(() => {
    console.log("token useAuth() function se aaya");
    console.log(token)
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products", {
          headers: {
            Authorization: `Bearer ${token}`, // token ko header me bhej rahe hai isse pata chalega user login hai , middleware verify krega.
          },
        });
        console.log("fetch all products API Response")
        console.log(response);
        const data = await response.json();
        console.log("converting the data of the response in json format");  
        console.log(data);
        if (!response.ok) {
          setError(data.message || "Failed to load products");
          return;
        }
        setProducts(data.products);
      } catch (err) {
        setError("Cannot reach server");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);     // agar token expire/change hoga toh refetch krega ye true hone se.

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  console.log("please clear confusion");
  console.log(filteredProducts);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">All Products</h1>
            <p className="text-slate-400 text-sm mt-1">
              {filteredProducts.length} items available
            </p>
          </div>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 text-white placeholder-slate-500
            rounded-xl px-4 py-2.5 text-sm w-full sm:w-64 focus:outline-none
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent
              rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400
                          rounded-xl p-4 text-center">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center text-slate-400 py-16">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default HomePage;