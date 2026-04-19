const express = require('express');
const router = express.Router();
const { toggleLike, getLikes } = require('../controllers/likeController');
const protect = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuthMiddleware');
router.get('/:blogId', optionalAuth, getLikes);
router.post('/:blogId', protect, toggleLike);
module.exports = router;
