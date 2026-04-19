
const express = require('express');
const router = express.Router();
const {
    getAllBlogs,
    getBlogById,
    getBlogDetails,
    createBlog,
    updateBlog,
    deleteBlog,
} = require('../controllers/blogController');
const protect = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuthMiddleware');
const { uploadBlogImage } = require('../middleware/uploadMiddleware');
router.get('/', getAllBlogs);
router.get('/:id/details', optionalAuth, getBlogDetails);
router.get('/:id', getBlogById);
router.post('/', protect, uploadBlogImage.single('image'), createBlog);
router.put('/:id', protect, uploadBlogImage.single('image'), updateBlog);
router.delete('/:id', protect, deleteBlog);
module.exports = router;
