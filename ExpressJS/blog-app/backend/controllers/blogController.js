// File: backend/controllers/blogController.js

const { Blog, User } = require('../models/index');

// ─── GET ALL BLOGS (Public) ──────────────────────────────────
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll({
            // SELECT * FROM Blogs
            include: [{
                model: User,          // Users table se bhi data lao
                as: 'author',         // index.js mein 'as: author' define kiya tha
                attributes: ['username', 'email'], // sirf yeh fields lao, password nahi
            }],
            order: [['createdAt', 'DESC']], // naye blogs pehle dikhao
        });

        res.status(200).json({
            message: 'Blogs fetched successfully',
            count: blogs.length,  // total kitne blogs hain
            blogs
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ─── GET SINGLE BLOG (Public) ────────────────────────────────
const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        // URL se id lo — jaise /api/blogs/5 → id = 5

        const blog = await Blog.findOne({
            where: { id },
            include: [{
                model: User,
                as: 'author',
                attributes: ['username', 'email'],
            }],
        });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json({ message: 'Blog fetched successfully', blog });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ─── CREATE BLOG (Protected) ─────────────────────────────────
const createBlog = async (req, res) => {
    try {
        const { title, content, image_url } = req.body;

        const userId = req.user.userId;
        // req.user protect middleware ne set kiya tha
        // Isse pata chalta hai kaun sa logged-in user blog bana raha hai

        const blog = await Blog.create({
            title,
            content,
            image_url,
            userId, // blog ko user se jodo
        });

        res.status(201).json({ message: 'Blog created successfully', blog });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ─── UPDATE BLOG (Protected) ─────────────────────────────────
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, image_url } = req.body;

        const blog = await Blog.findOne({ where: { id } });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (blog.userId !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to edit this blog' });
            // 403 = Forbidden — sirf owner edit kar sakta hai
        }

        await blog.update({ title, content, image_url });

        res.status(200).json({ message: 'Blog updated successfully', blog });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ─── DELETE BLOG (Protected) ─────────────────────────────────
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findOne({ where: { id } });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (blog.userId !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this blog' });
        }

        await blog.destroy();
        // DB se permanently delete karo

        res.status(200).json({ message: 'Blog deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };