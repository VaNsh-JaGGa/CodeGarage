import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const storedBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    setBlogs(storedBlogs);
  }, []);
  
  return (
    <div className="min-h-screen bg-[#efefef]">
      <NavBar />
      {blogs.length === 0 ? (
        <p className="text-center text-gray-500 text-lg py-6">
          No blogs available
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 py-3 px-10">
          {blogs.map((item, i) => (
            <div key={i} className="bg-white shadow-md">

              <img
                src={item.image}
                alt="blog"
                className="w-full h-56 object-cover"
              />

              <div className="p-4">
                <p className="text-sm text-sky-500 mb-2 break-words">
                  {item.date} {item.category ? `/ ${item.category}` : ""}
                </p>

                <h2 className="text-lg font-semibold mb-2 break-words">
                  {item.title}
                </h2>

                <p className="text-gray-500 text-sm mb-4 break-words">
                  {item.description}
                </p>

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
