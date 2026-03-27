import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const Home = () => {

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const storedBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    setBlogs(storedBlogs);
  }, []);

  function deletecard(index) {
    const updatedBlogs = blogs.filter((_, i) => i !== index);
    setBlogs(updatedBlogs);
    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
  }

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
                  {item.date} / {item.category}
                </p>

                <h2 className="text-lg font-semibold mb-2 break-words">
                  {item.title}
                </h2>

                <p className="text-gray-500 text-sm mb-4 break-words">
                  {item.description}
                </p>

                <div className="flex flex-col gap-3 mt-10">
                  <button
                    className="text-sm font-medium break-words w-full max-w-20 border-2 border-black rounded p-1 hover:bg-black hover:text-white transition-all duration-100"
                    onClick={() => navigate(`/addblog/${i}`)}
                  >
                    EDIT
                  </button>

                  <button className="text-sm font-medium break-words w-full max-w-50 border-2 border-black rounded p-1 hover:bg-black hover:text-white transition-all duration-100" onClick={() => { deletecard(i) }}>
                    DELETE CARD BUTTON
                  </button>
                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Home;