const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDirectory = path.join(__dirname, '..', 'uploads', 'blogs');
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, uploadDirectory);
    },
    filename: (_req, file, callback) => {
        const safeName = file.originalname.replace(/\s+/g, '-');
        callback(null, `${Date.now()}-${safeName}`);
    },
});

const fileFilter = (_req, file, callback) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
        callback(null, true);
        return;
    }

    callback(new Error('Only image files are allowed'));
};

const uploadBlogImage = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

module.exports = { uploadBlogImage };
