import { useState } from "react"; 

const AddBlog = () => {

    const [form, setForm] = useState({
        image: "",
        title: "",
        category: "",
        description: ""
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {

            // 1. Get existing blogs
            let existingBlogs = JSON.parse(localStorage.getItem("blogs")) || [];

            // 2. Add new blog
            const newBlog = {
                ...form,
                date: new Date().toDateString()
            };

            const updatedBlogs = [...existingBlogs, newBlog];

            // 3. Save back
            localStorage.setItem("blogs", JSON.stringify(updatedBlogs));

            // 4. Redirect
            window.location.href = "/home"; // or use navigate

        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-2xl p-8 rounded-lg shadow-md">

                <h2 className="text-2xl font-bold text-center mb-6">Add New Blog</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Image */}
                    <div className="flex flex-col gap-1">
                        <label for="img">Image URL</label>
                        <input
                            type="text"
                            id="img"
                            name="image"
                            value={form.image}
                            onChange={handleChange}
                            placeholder="Image URL"
                            className="border p-2 rounded"
                        />
                        {errors.image && <span className="text-red-500 text-sm">{errors.image}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label for="tit">Title</label>
                        <input
                            type="text"
                            id="tit"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Title"
                            className="border p-2 rounded mr-6"
                        />
                        {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label for="cate">Category</label>
                        <input
                            type="text"
                            id="cate"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            placeholder="Category"
                            className="border p-2 rounded mr-6"
                        />
                        {errors.category && <span className="text-red-500 text-sm">{errors.category}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label for="desc">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            cols={80}
                            id="desc"
                            rows={4}
                            onChange={handleChange}
                            placeholder="Description"
                            className="border p-2 rounded"
                        />
                        {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                    </div>

                    <button className="bg-blue-500 text-white p-2 rounded">
                        Add Blog
                    </button>

                </form>
            </div>
        </div>
    );
};

export default AddBlog;