const express = require('express');
const router = express.Router();
const { toggleLike, getLikes } = require('../controllers/likeController');
const protect = require('../middleware/authMiddleware');
router.get('/:blogId', protect, getLikes);
router.post('/:blogId', protect, toggleLike);
module.exports = router;