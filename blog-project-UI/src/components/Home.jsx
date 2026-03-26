import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navi = useNavigate();

  const [blogs, setBlogs] = useState([]);


  useEffect(() => {
    const storedBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    setBlogs(storedBlogs);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-10 py-6">

      <div className="relative mb-30">

        {/* Logout */}
        <button
          className="absolute right-0 top-0 bg-black text-pink-500 px-6 py-2 rounded text-lg font-medium cursor-pointer"
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("currentUser");
            navi("/");
          }}
        >
          Log Out
        </button>

        {/* Add Blog */}
        <button
          className="absolute right-[9rem] top-0 bg-black text-pink-500 px-6 py-2 rounded text-lg font-medium cursor-pointer"
          onClick={() => {
            navi("/addblog");
          }}
        >
          Add Blog
        </button>

        <div className="text-center">
          <p className="text-pink-500 text-lg font-medium">
            My Recent Posts
          </p>
          <h1 className="text-4xl font-bold">My Blog</h1>
        </div>
      </div>

      {/* 🔹 If no blogs */}
      {blogs.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No blogs available
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-8">

          {blogs.map((item, i) => (
            <div key={i} className="bg-white shadow-md">

              <img
                src={item.image}
                alt="blog"
                className="w-full h-56 object-cover"
              />

              <div className="p-4">
                <p className="text-sm text-pink-500 mb-2">
                  {item.date} / {item.category}
                </p>

                <h2 className="text-lg font-semibold mb-2">
                  {item.title}
                </h2>

                <p className="text-gray-500 text-sm mb-4">
                  {item.description}
                </p>

                <button className="text-sm font-medium">
                  Read More
                </button>
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Home;