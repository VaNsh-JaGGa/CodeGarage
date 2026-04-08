
const express = require('express');
const router = express.Router();
const {
    addComment,
    getComments,
    deleteComment,
    editComment,
} = require('../controllers/commentController');
const protect = require('../middleware/authMiddleware');

router.get('/:blogId', getComments);
router.post('/:blogId', protect, addComment);
router.put('/edit/:commentId', protect, editComment);
router.delete('/delete/:commentId', protect, deleteComment);

module.exports = router;