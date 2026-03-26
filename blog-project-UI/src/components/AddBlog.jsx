
const AddBlog = () => {
    return (
        <>
            <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
                <div class="bg-white w-full max-w-2xl p-8 rounded-lg shadow-md">

                    <h2 class="text-2xl font-bold text-center mb-6">Add New Blog</h2>

                    <form class="flex flex-col gap-5">

                        {/* <!-- Image URL --> */}
                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">Image URL</label>
                            <input
                                type="text"
                                placeholder="Enter image URL"
                                class="border border-gray-300 p-2 rounded outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* <!-- Title --> */}
                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">Title</label>
                            <input
                                type="text"
                                placeholder="Enter blog title"
                                class="border border-gray-300 p-2 rounded outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* <!-- Category --> */}
                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">Category</label>
                            <input
                                type="text"
                                placeholder="e.g. Design Ideas"
                                class="border border-gray-300 p-2 rounded outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* <!-- Description --> */}
                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium">Description</label>
                            <textarea
                                rows="4"
                                placeholder="Write short description..."
                                class="border border-gray-300 p-2 rounded outline-none focus:border-blue-500 resize-none"
                            ></textarea>
                        </div>

                        {/* <!-- Buttons --> */}
                        <div class="flex justify-between mt-4">
                            <button
                                type="button"
                                class="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                                Add Blog
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}

export default AddBlog
