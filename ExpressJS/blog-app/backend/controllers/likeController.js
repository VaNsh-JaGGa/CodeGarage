const { Like, Blog } = require('../models/Index');

const getLikeStats = async (blogId, userId = null) => {
    const likeCount = await Like.count({
        where: { blogId, type: 'like' },
    });

    const dislikeCount = await Like.count({
        where: { blogId, type: 'dislike' },
    });

    let userReaction = null;

    if (userId) {
        const reaction = await Like.findOne({
            where: { userId, blogId },
        });
        userReaction = reaction ? reaction.type : null;
    }

    return { likeCount, dislikeCount, userReaction };
};

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
        if (existingReaction){
            if (existingReaction.type === type) {
                await existingReaction.destroy();
                const stats = await getLikeStats(blogId, userId);
                return res.status(200).json({ message: `${type} removed`, stats });
            }
            else {
                await existingReaction.update({ type });
                const stats = await getLikeStats(blogId, userId);
                return res.status(200).json({ message: `Switched to ${type}`, reaction: existingReaction, stats });
            }
        }
        const newReaction = await Like.create({ userId, blogId, type });
        const stats = await getLikeStats(blogId, userId);
        res.status(201).json({ message: `Blog ${type}d successfully`, reaction: newReaction, stats });
    }

    catch (error) 
    {
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
        const stats = await getLikeStats(blogId, req.user?.userId || null);
        res.status(200).json(stats); 
    }

    catch(error)
    {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { toggleLike, getLikes, getLikeStats };
