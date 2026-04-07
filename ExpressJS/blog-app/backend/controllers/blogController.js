const { Blog, User } = require('../models/Index');

const getAllBlogs = async (req, res) => {
    try
    {
        const blogs = await Blog.findAll({
            include: [{
                model: User,
                as: 'author',
                attributes: ['username', 'email'],
            }],
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({
            message: 'Blogs fetched successfully',
            count: blogs.length, 
            blogs
        });
    }
    catch (error) 
    {
        res.status(404).json({ message: 'No Blogs', error: error.message });
    }
};

const getBlogById = async (req, res) => {
    try 
    {
        const { id } = req.params;
        const blog = await Blog.findOne({
            where: { id },
            include: [{
                model: User,
                as: 'author',
                attributes: ['username', 'email'],
            }],
        });
        if(!blog) 
        {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog fetched successfully', blog });
    }
    catch (error) 
    {
        res.status(404).json({ message: 'No Blog', error: error.message });
    }
};

const createBlog = async (req, res) => {
    try 
    {
        const { title, content, image_url } = req.body;
        const userId = req.user.userId;
        const blog = await Blog.create({
            title,
            content,
            image_url,
            userId,
        });
        res.status(201).json({ message: 'Blog created successfully', blog });
    }
    catch (error) 
    {
        res.status(500).json({ message: 'User Not Matched', error: error.message });
    }
};

const updateBlog = async (req, res) => {
    try{
        const { id } = req.params;
        const { title, content, image_url } = req.body;
        const blog = await Blog.findOne({ where: { id } });
        if (!blog) 
        {
            return res.status(404).json({ message: 'Blog not found' });
        }
        if (blog.userId !== req.user.userId) 
        {
            return res.status(403).json({ message: 'Not authorized to edit this blog' });
        }
        await blog.update({ title, content, image_url });
        res.status(200).json({ message: 'Blog updated successfully', blog });
    } 
    catch (error) 
    {
        res.status(500).json(
            { message: 'Server error', error: error.message }
        );
    }
};

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
        res.status(200).json({ message: 'Blog deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };