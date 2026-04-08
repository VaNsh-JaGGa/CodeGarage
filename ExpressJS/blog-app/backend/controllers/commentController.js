const { Comment, User, Blog } = require('../models/Index');
const addComment = async (req, res) => {
    try {
        const blogId = parseInt(req.params.blogId);
        const userId = req.user.userId;
        const { text } = req.body;
        if (!text || text.trim() === '')
        {
            return res.status(404).json({ message: 'Comment text is required' });
        }
        const blog = await Blog.findOne(
            { where: { id: blogId } }
        );
        if (!blog) 
        {
            return res.status(404).json({ message: 'Blog not found' });
        }
        const comment = await Comment.create(
            {
            text: text.trim(),
            userId,
            blogId,
            }
    );
        const commentWithUser = await Comment.findOne({
            where: { id: comment.id },
            include: [{
                model: User,
                as: 'commenter',
                attributes: ['id', 'username'],
            }],
        });
        res.status(201).json(
            {
            message: 'Comment added successfully',
            comment: commentWithUser,
            }
        );
    } 
    catch (error) 
    {
        res.status(500).json(
            { message: 'Server error', error: error.message }
        );
    }
};

const getComments = async (req, res) => {
    try {
        const blogId = parseInt(req.params.blogId);
        const blog = await Blog.findOne(
        {
        where: { id: blogId } 
        }
    );
        if (!blog) 
        {
            return res.status(404).json
            (
            { message: 'Blog not found' }
            );
        }
        const comments = await Comment.findAll({
            where: { blogId },
            include: [{
                model: User,
                as: 'commenter',
                attributes: ['id', 'username'],
            }],
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json(comments);
        // Return array of all comments for this blog
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.userId;
        const comment = await Comment.findOne(
            { where: { id: commentId } }
        );
        if (!comment) 
        {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.userId !== userId) 
        {
            return res.status(403).json({ message: 'You can only delete your own comments' });
        }
        await comment.destroy();
        res.status(200).json(
            { message: 'Comment deleted successfully' }
        );
    } 
    catch (error)
    {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const editComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.userId;
        const { text } = req.body;
        if (!text || text.trim() === '') {
            return res.status(400).json({ message: 'Comment text is required' });
        }
        const comment = await Comment.findOne(
            { where: { id: commentId } }
        );
        if (!comment) 
        {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.userId !== userId) 
        {
            return res.status(403).json({ message: 'You can only edit your own comments' });
        }
        await comment.update(
            { text: text.trim() }
        );
        res.status(200).json(
            { message: 'Comment updated successfully',comment}
        );
    }
     catch (error) 
     {
        res.status(500).json(
            { message: 'Server error', error: error.message }
        );
     }
};

module.exports = { addComment, getComments, deleteComment, editComment };