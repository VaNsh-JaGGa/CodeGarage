import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { apiRequest } from "../utils/api";
import FixedNavBar from "./FixedNavBar";

const AddBlog = () => {
    const navi = useNavigate();
    const { id } = useParams();
    const [form,setForm] = useState({
        image: "",
        title: "",
        category: "",
        description: ""
    });

    useEffect(() => {
        const loadBlogForEditing = async () => {
            if (id === undefined) {
                return;
            }
            try{
                const data = await apiRequest(`/blogs/${id}`);
                setForm({
                    image: data.blog.image_url || "",
                    title: data.blog.title || "",
                    category: data.blog.category || "",
                    description: data.blog.content || ""
                });
            }
            catch (error) {
                toast.error(error.message || "Failed to load blog");
            }
        };

        loadBlogForEditing();
    }, [id]);

    const [errors, setErrors] = useState({});
    const validateField = (name, value) => {

        let error = "";
        if (name === "image") {
            if (!value) {
                error = "Image URL is required";
            } else if (!/^https?:\/\/.+/.test(value)) {
                error = "Enter a valid URL";
            }
        }

        if (name === "title") {
            if (!value) {
                error = "Title is required";
            } else if (value.length < 3) {
                error = "Minimum 3 characters required";
            }
        }

        if (name === "category") {
            if (!value) {
                error = "Category is required";
            }
        }

        if (name === "description") {
            if (!value) {
                error = "Description is required";
            } else if (value.length < 10) {
                error = "Minimum 10 characters required";
            }
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
        const error = validateField(name, value);
        setErrors((prev) => ({
            ...prev,
            [name]: error
        }));
    };

    const validateForm = () => {
        let newErrors = {};

        const imageError = validateField("image", form.image);
        if (imageError) newErrors.image = imageError;

        const titleError = validateField("title", form.title);
        if (titleError) newErrors.title = titleError;

        const categoryError = validateField("category", form.category);
        if (categoryError) newErrors.category = categoryError;

        const descriptionError = validateField("description", form.description);
        if (descriptionError) newErrors.description = descriptionError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const payload = {
                    title: form.title,
                    content: form.description,
                    image_url: form.image,
                    category: form.category
                };

                if (id !== undefined) {
                    await apiRequest(`/blogs/${id}`, {
                        method: "PUT",
                        body: JSON.stringify(payload)
                    });
                    toast.success("Blog updated successfully");
                } else {
                    await apiRequest("/blogs", {
                        method: "POST",
                        body: JSON.stringify(payload)
                    });
                    toast.success("Blog created successfully");
                }

                navi('/realhome');
            } catch (error) {
                toast.error(error.message || "Failed to save blog");
            }
        }
    };

    return (
        <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
            <Toaster />
            <div className="mx-auto max-w-7xl space-y-8">
                <FixedNavBar />
                <div className="mx-auto w-full max-w-4xl rounded-[2rem] border border-[rgba(93,64,55,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(249,241,233,0.86))] p-6 shadow-[0_18px_60px_rgba(54,32,24,0.12)] sm:p-8 lg:p-10">

                    <div className="mb-8">
                        <p className="mb-4 inline-flex items-center rounded-full bg-[rgba(184,92,56,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#8e4427]">{id !== undefined ? "Update post" : "Create post"}</p>
                        <h2 className="text-3xl font-semibold leading-tight text-[#241916] sm:text-4xl">{id !== undefined ? "Refine your story before it goes live." : "Write a new post in a cleaner editor."}</h2>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6d5b56] sm:text-base">
                            Add the details for your article and keep the visual tone aligned with the rest of the refreshed blog app.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="img" className="text-sm font-medium text-[#6d5b56]">Image URL</label>
                            <input
                                type="text"
                                id="img"
                                name="image"
                                value={form.image}
                                onChange={handleChange}
                                className={`w-full rounded-2xl border bg-white/90 px-4 py-3.5 outline-none transition focus:border-[rgba(184,92,56,0.5)] focus:ring-4 focus:ring-[rgba(184,92,56,0.12)] ${errors.image ? "border-red-400 ring-4 ring-red-100" : "border-[rgba(93,64,55,0.12)]"}`}
                            />
                            {errors.image && <span className="text-red-500 text-sm">{errors.image}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="tit" className="text-sm font-medium text-[#6d5b56]">Title</label>
                            <input
                                type="text"
                                id="tit"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className={`w-full rounded-2xl border bg-white/90 px-4 py-3.5 outline-none transition focus:border-[rgba(184,92,56,0.5)] focus:ring-4 focus:ring-[rgba(184,92,56,0.12)] ${errors.title ? "border-red-400 ring-4 ring-red-100" : "border-[rgba(93,64,55,0.12)]"}`}
                            />
                            {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="cate" className="text-sm font-medium text-[#6d5b56]">Category</label>
                            <input
                                type="text"
                                id="cate"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className={`w-full rounded-2xl border bg-white/90 px-4 py-3.5 outline-none transition focus:border-[rgba(184,92,56,0.5)] focus:ring-4 focus:ring-[rgba(184,92,56,0.12)] ${errors.category ? "border-red-400 ring-4 ring-red-100" : "border-[rgba(93,64,55,0.12)]"}`}
                            />
                            {errors.category && <span className="text-red-500 text-sm">{errors.category}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="desc" className="text-sm font-medium text-[#6d5b56]">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                id="desc"
                                rows={7}
                                onChange={handleChange}
                                className={`w-full resize-none rounded-2xl border bg-white/90 px-4 py-3.5 outline-none transition focus:border-[rgba(184,92,56,0.5)] focus:ring-4 focus:ring-[rgba(184,92,56,0.12)] ${errors.description ? "border-red-400 ring-4 ring-red-100" : "border-[rgba(93,64,55,0.12)]"}`}
                            />
                            {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                        </div>

                        <button className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#b85c38] px-5 py-3 font-semibold text-white shadow-[0_12px_24px_rgba(184,92,56,0.26)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#8e4427] sm:w-auto">
                            {id !== undefined ? "Update Blog" : "Publish Blog"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddBlog;