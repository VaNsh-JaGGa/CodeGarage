const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Token } = require('../models/Index');
require('dotenv').config();

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) 
        {
            return res.status(400).json({ message: 'Email already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create
        ({
            username,
            email,
            password: hashedPassword,
        });
        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } 
    catch (error) 
    {
        res.status(400).json({ message: 'Invalid Credentials', error: error.message });
    }
};

const login = async (req, res) => {

    try 
    {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) 
        {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password is Wrong' });
        }
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        await Token.create({
            token,           
            userId: user.id  
        });
        res.status(200).json({
            message: 'Login successful',
            token,
            userId: user.id,
            username: user.username,
        });
    } 

    catch (error) 
    {
        res.status(400).json({ message: 'Invalid Credentials', error: error.message });
    }
};

const logout = async (req, res) => {
    try 
    {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token)
        {
            return res.status(400).json({ message: 'No token provided' });
        }
        await Token.destroy({ where: { token } });
        res.status(200).json({ message: 'Logged out successfully' });
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { signup, login, logout };