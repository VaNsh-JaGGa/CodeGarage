import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { apiRequest, getBlogCardData } from "../utils/api";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await apiRequest("/blogs");
        setBlogs((data.blogs || []).map(getBlogCardData));
      } catch {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);
  
  return (
    <div className="min-h-screen px-4 pb-10 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <NavBar />
        <section className="rounded-[2rem] border border-[rgba(93,64,55,0.12)] bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(249,241,233,0.74))] p-8 shadow-[0_18px_60px_rgba(54,32,24,0.12)] backdrop-blur md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 inline-flex items-center rounded-full bg-[rgba(184,92,56,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#8e4427]">Featured collection</p>
              <h2 className="text-3xl font-semibold leading-tight text-[#241916] sm:text-4xl">A calmer, more readable home for every post.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6d5b56] sm:text-base">
                Browse a curated feed with roomy cards, warmer tones, and a layout that feels closer to polished blog platforms.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-[#6d5b56] sm:grid-cols-3">
              <div className="rounded-2xl bg-white/70 px-4 py-3">
                <p className="text-2xl font-semibold text-[#241916]">{blogs.length}</p>
                <p>Published stories</p>
              </div>
              <div className="rounded-2xl bg-white/70 px-4 py-3">
                <p className="text-2xl font-semibold text-[#241916]">Clean</p>
                <p>Editorial feel</p>
              </div>
              <div className="rounded-2xl bg-white/70 px-4 py-3">
                <p className="text-2xl font-semibold text-[#241916]">Fresh</p>
                <p>Modern cards</p>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <p className="py-14 text-center text-base text-[#6d5b56]">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="py-14 text-center text-base text-[#6d5b56]">No blogs available yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {blogs.map((item, i) => (
              <article key={i} className="overflow-hidden rounded-[1.6rem] border border-[rgba(93,64,55,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,245,239,0.92))] shadow-[0_14px_40px_rgba(46,25,20,0.08)] transition duration-300 hover:-translate-y-1">
                <img
                  src={item.image}
                  alt={item.title || "blog"}
                  className="h-60 w-full object-cover"
                />

                <div className="flex min-h-[15rem] flex-col gap-4 p-6">
                  <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-[#b85c38]">
                    {item.date} {item.category ? `/ ${item.category}` : ""}
                  </p>

                  <h2 className="break-words text-2xl font-semibold leading-tight text-[#241916]">
                    {item.title}
                  </h2>

                  <p className="break-words text-sm leading-7 text-[#6d5b56]">
                    {item.description}
                  </p>

                  <div className="pt-2">
                    <span className="inline-flex cursor-default items-center justify-center rounded-full border border-[rgba(93,64,55,0.22)] bg-white/70 px-4 py-2.5 font-semibold text-[#241916]">Read preview</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
