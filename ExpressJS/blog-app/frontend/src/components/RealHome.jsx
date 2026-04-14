import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FixedNavBar from "../components/FixedNavBar";
import toast, { Toaster } from "react-hot-toast";
import { apiRequest, getBlogCardData } from "../utils/api";

const RealHome = () => {
    let navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBlogs = async () => {
            try {
                const data = await apiRequest("/blogs");
                setBlogs((data.blogs || []).map(getBlogCardData));
            } catch (error) {
                toast.error(error.message || "Failed to load blogs");
                setBlogs([]);
            } finally {
                setLoading(false);
            }
        };
        loadBlogs();
    }, []);

    async function deletecard(blogId) {
        try {
            await apiRequest(`/blogs/${blogId}`, {
                method: "DELETE",
            });
            setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
            toast.success("Blog deleted successfully");
        } catch (error) {
            toast.error(error.message || "Failed to delete blog");
        }
    }

    return (
        <div className="min-h-screen px-4 pb-10 pt-5 sm:px-6 lg:px-8">
            <Toaster />
            <div className="mx-auto max-w-7xl space-y-8">
                <FixedNavBar />
                <section className="rounded-[2rem] border border-[rgba(93,64,55,0.12)] bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(249,241,233,0.74))] p-8 shadow-[0_18px_60px_rgba(54,32,24,0.12)] backdrop-blur md:p-10">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="mb-4 inline-flex items-center rounded-full bg-[rgba(184,92,56,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#8e4427]">Your workspace</p>
                            <h2 className="text-3xl font-semibold leading-tight text-[#241916] sm:text-4xl">Edit and organize posts with less clutter.</h2>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6d5b56] sm:text-base">
                                This dashboard keeps your content actions close at hand while still feeling like part of the public site.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-white/70 px-5 py-4 text-sm text-[#6d5b56]">
                            <p className="text-3xl font-semibold text-[#241916]">{blogs.length}</p>
                            <p>Stories in your library</p>
                        </div>
                    </div>
                </section>

                {loading ? (
                    <p className="py-14 text-center text-base text-[#6d5b56]">
                        Loading blogs...
                    </p>
                ) : blogs.length === 0 ? (
                    <p className="py-14 text-center text-base text-[#6d5b56]">
                        No blogs available yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {blogs.map((item, i) => (
                            <article key={i} className="overflow-hidden rounded-[1.6rem] border border-[rgba(93,64,55,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,245,239,0.92))] shadow-[0_14px_40px_rgba(46,25,20,0.08)] transition duration-300 hover:-translate-y-1">
                                <img
                                    src={item.image}
                                    alt={item.title || "blog"}
                                    className="h-56 w-full object-cover sm:h-60"
                                    onClick={() => navigate(`/blog/${item.id}`)}
                                />

                                <div className="flex min-h-[15rem] flex-col gap-4 p-6">
                                    <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-[#b85c38]">
                                        {item.date} {item.category ? `/ ${item.category}` : ""}
                                    </p>

                                    <h2
                                        className="cursor-pointer break-words text-2xl font-semibold leading-tight text-[#241916]"
                                        onClick={() => navigate(`/blog/${item.id}`)}
                                    >
                                        {item.title}
                                    </h2>

                                    <p className="break-words text-sm leading-7 text-[#6d5b56]">
                                        {item.description}
                                    </p>

                                    <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
                                        <button
                                            className="inline-flex w-full items-center justify-center rounded-full border border-[rgba(93,64,55,0.22)] bg-[#241916] px-4 py-2.5 font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#3a2925] sm:w-auto"
                                            onClick={() => navigate(`/blog/${item.id}`)}
                                        >
                                            View Details
                                        </button>
                                        <button
                                            className="inline-flex w-full items-center justify-center rounded-full border border-[rgba(93,64,55,0.22)] bg-white/70 px-4 py-2.5 font-semibold text-[#241916] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(184,92,56,0.35)] hover:text-[#8e4427] sm:w-auto"
                                            onClick={() => navigate(`/addblog/${item.id}`)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="inline-flex w-full items-center justify-center rounded-full bg-[#b85c38] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(184,92,56,0.26)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#8e4427] sm:w-auto"
                                            onClick={() => { deletecard(item.id) }}
                                        >
                                            Delete Post
                                        </button>
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

export default RealHome;
