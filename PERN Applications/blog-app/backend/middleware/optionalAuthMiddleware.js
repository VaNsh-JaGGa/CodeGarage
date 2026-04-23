const jwt = require('jsonwebtoken');
const { Token } = require('../models/Index');
require('dotenv').config();

const optionalAuth = async (req, _res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return next();
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return next();
    }

    try {
        const storedToken = await Token.findOne({ where: { token } });

        if (!storedToken) {
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (_error) {
    }

    next();
};

module.exports = optionalAuth;
