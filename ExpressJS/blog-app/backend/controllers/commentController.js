const { Comment, User, Blog } = require('../models/Index');
const buildTree = (comments) => {
    const map = {};
    const roots = [];
    comments.forEach(comment => {
        const obj = comment.toJSON();
        obj.replies = [];
        map[obj.id] = obj;
    });

    comments.forEach(comment => {
        const obj = map[comment.id];
        if (obj.parentId === null) {
            roots.push(obj);
        } else {
            const parentComment = map[obj.parentId];
            if (parentComment) {
                parentComment.replies.push(obj);
            }
        }
    });
    return roots;
};

const addComment = async (req, res) => {
    try {
        const blogId = parseInt(req.params.blogId);
        const userId = req.user.userId;
        const { text, parentId } = req.body;
        if (!text || text.trim() === '') {
            return res.status(400).json({ message: 'Comment text is required' });
        }
        const blog = await Blog.findOne({ where: { id: blogId } });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        if (parentId) {
            const parentComment = await Comment.findOne({ where: { id: parentId } });
            if (!parentComment) {
                return res.status(404).json({ message: 'Parent comment not found' });
            }
            if (parentComment.blogId !== blogId) {
                return res.status(400).json({ message: 'Parent comment is not on this blog' });
            }
        }
        const comment = await Comment.create({
            text: text.trim(),
            userId,
            blogId,
            parentId: parentId || null,
        });
        console.log(comment);
        const commentWithUser = await Comment.findOne({
            where: { id: comment.id },
            include: [{
                model: User,
                as: 'commenter',
                attributes: ['id', 'username'],
            }],
        });
        res.status(201).json({
            message: parentId ? 'Reply added successfully' : 'Comment added successfully',
            comment: commentWithUser,
        });
    }

    catch (error) 
    {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getComments = async (req, res) => {
    try {
        const blogId = parseInt(req.params.blogId);
        const blog = await Blog.findOne({ where: { id: blogId } });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        const allComments = await Comment.findAll({
            where: { blogId },
            include: [{
                model: User,
                as: 'commenter',
                attributes: ['id', 'username'],
            }],
            order: [['createdAt', 'ASC']],
        });
        const tree = buildTree(allComments);
        res.status(200).json(tree);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.userId;

        const comment = await Comment.findOne({ where: { id: commentId } });
        if (!comment) 
        {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.userId !== userId) 
        {
            return res.status(403).json({ message: 'You can only delete your own comments' });
        }
        await Comment.destroy({
            where: {
                [require('sequelize').Op.or]: [
                    { id: commentId },
                    { parentId: commentId },

                ]
            }
        });
        res.status(200).json({ message: 'Comment and its replies deleted successfully' });
    } catch (error) {
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
        const comment = await Comment.findOne({ where: { id: commentId } });
        if (!comment) 
        {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.userId !== userId)
        {
            return res.status(403).json({ message: 'You can only edit your own comments' });
        }
        await comment.update({ text: text.trim() });
        res.status(200).json({ message: 'Comment updated successfully', comment });
    }
    catch (error)
    {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { addComment, getComments, deleteComment, editComment };