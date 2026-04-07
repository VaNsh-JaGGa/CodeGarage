const { Like, Blog } = require('../models/Index');
const toggleLike = async (req, res) => {
    try {
        const blogId = parseInt(req.params.blogId);
        const userId = req.user.userId;
        const { type } = req.body;
        if (!['like', 'dislike'].includes(type)) {
            return res.status(400).json({ message: 'Type must be like or dislike' });
        }
        const blog = await Blog.findOne(
            { where: { id: blogId } }
        );
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        const existingReaction = await Like.findOne
            ({
                where: { userId, blogId },
            });
        if (existingReaction) {
            if (existingReaction.type === type) {
                await existingReaction.destroy();
                return res.status(200).json({ message: `${type} removed` });
            }
            else {
                await existingReaction.update({ type });
                return res.status(200).json({ message: `Switched to ${type}`, reaction: existingReaction });
            }
        }
        const newReaction = await Like.create({ userId, blogId, type });
        res.status(201).json({ message: `Blog ${type}d successfully`, reaction: newReaction });
    }
    catch (error) {
        res.status(404).json({ message: 'Resource Missing', error: error.message });
    }
};

const getLikes = async (req, res) => {
    try {
        const blogId = parseInt(req.params.blogId);
        const blog = await Blog.findOne({ where: { id: blogId } });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        const likeCount = await Like.count({
            where: { blogId, type: 'like' },
        });
        const dislikeCount = await Like.count({
            where: { blogId, type: 'dislike' },
        });
        let userReaction = null;
        if (req.user) {
            const reaction = await Like.findOne({
                where: { userId: req.user.userId, blogId },
            });
            userReaction = reaction ? reaction.type : null;
        }
        res.status(200).json(
            { likeCount, dislikeCount, userReaction }
        );
    }
    catch (error) 
    {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { toggleLike, getLikes };