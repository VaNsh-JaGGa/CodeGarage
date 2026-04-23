
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
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/blogs");
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|webp|avif/;
    const isMimeValid = allowedTypes.test(file.mimetype.toLowerCase());
    const isExtValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (isMimeValid && isExtValid) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/', getAllBlogs);
router.get('/:id/details', getBlogDetails);
router.get('/:id', getBlogById);
router.post("/", protect, upload.single("image"), createBlog); // file field should be named imageeeeeeeee
router.put("/:id", protect, upload.single("image"), updateBlog);
router.delete('/:id', protect, deleteBlog);
module.exports = router;
