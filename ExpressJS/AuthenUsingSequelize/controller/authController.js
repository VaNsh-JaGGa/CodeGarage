const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email: email,
            password: hashedPassword
        });
        res.status(201).json({
            id: user.id,
            email: user.email
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req,res) => {
    try{
        const {email,password} = req.body;
        const user = await User.findOne({
            where:{email:email}
        })
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }
        const validPassword  = await bcrypt.compare(password,user.password)
        if (!validPassword) {
            return res.status(400).json({ msg: "Invalid password" });
        }
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};