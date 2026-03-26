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
    <div className="min-h-screen bg-[#efefef]">

      <div className=" flex flex-col gap-[2.5rem] sm:flex-row sm:justify-between  sm:gap-[1rem] relative mb-30 bg-[#efefef] px-10 py-5">

        <div className="text-center">
          <p className="text-black text-lg font-medium">
            My Recent Posts
          </p>
          <h1 className="text-4xl font-bold text-black">My Blog</h1>
        </div>

        <div className="flex flex-col gap-8 sm:flex-row sm:gap-15">
          <button
            className=" text-black-500 px-6 py-2 rounded text-xl font-bold cursor-pointer border-2 border-black sm:border-none"
            onClick={() => {
              navi("/addblog");
            }}
          >
            Add Blog
          </button>
          <button
            className=" text-black px-6 py-2 rounded text-xl font-bold cursor-pointer border-2 border-black sm:border-none"
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("currentUser");
              navi("/");
            }}
          >
            Log Out
          </button>

        </div>

      </div>

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