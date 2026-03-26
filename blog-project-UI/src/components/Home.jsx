import React from "react";
import  blog  from "../assets/blog.png"
import  blogg  from "../assets/blogg.jpg"
import  bloggg  from "../assets/bloggg.avif"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navi = useNavigate();

  const blogData = [
    {
      image: blog,
      title: "Design Ideas",
    },
    {
      image: blogg,
      title: "Creative UI",
    },
    {
      image: bloggg,
      title: "Modern Trends",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-10 py-6">

      {/* 🔹 Header */}
      <div className="relative mb-30">

        {/* Logout Button (Right) */}
        <button className="absolute right-0 top-0 bg-black text-pink-500 px-6 py-2 rounded text-lg font-medium cursor-pointer"
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("currentUser");
            navi("/");
          }}>
            Log Out
        </button>
        <button className="absolute right-[9rem] top-0 bg-black text-pink-500 px-6 py-2 rounded text-lg  font-medium cursor-pointer"
          onClick={() => {
              navi('/addblog');
          }}>
            Add Blog
        </button>

        {/* Center Content */}
        <div className="text-center">
          <p className="text-pink-500 text-lg font-medium">
            My Recent Posts
          </p>
          <h1 className="text-4xl font-bold">My Blog</h1>
        </div>
      </div>

      {/* 🔹 Cards */}
      <div className="grid grid-cols-3 gap-8">

        {/* Card */}
        {blogData.map((item,i) => (
          <div key={i} className="bg-white shadow-md">

            <img
              src={item.image}
              alt="blog"
              className="w-full h-56 object-cover"
            />

            <div className="p-4">
              <p className="text-sm text-pink-500 mb-2">
                18 July 2021 / {item.title}
              </p>

              <h2 className="text-lg font-semibold mb-2">
                What Has Happened of All of the Web Design Ideas?
              </h2>

              <p className="text-gray-500 text-sm mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit...
              </p>

              <button className="text-sm font-medium">
                Read More
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Home;