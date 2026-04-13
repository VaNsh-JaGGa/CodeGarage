const jwt = require('jsonwebtoken');
const { Token } = require('../models/Index');
require('dotenv').config();

const protect = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, access denied' });
    }
    const token = authHeader.split(' ')[1];
    try
    {
        const storedToken = await Token.findOne({ where: { token } });
        if (!storedToken) {
            return res.status(401).json({ message: 'Session expired or logged out' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    }
     catch (error) 
    {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = protect;