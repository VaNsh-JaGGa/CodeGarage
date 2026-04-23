const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); 
const { User } = require("../models/index");
require("dotenv").config();

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log(name,email,password,role);

        const existingUser = await User.findOne(
            { where: { email }}
        );
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("this is hashed password");
        const newUser = await User.create(
            {name,                     
            email,                           
            password: hashedPassword,     
            role:role || "buyer"}
        )
        console.log("this is the newUser")
        console.log(newUser);
        return res.status(201).json({
            message: "Signup successful",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
        
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Server error during Signup" });
    }
};

const login = async (req, res) => {

    try{
        const {email,password} = req.body;
        console.log(email,password);
        const user = await User.findOne({ where: { email } });
        console.log("findOne Method se aaya hua user");
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        // the isPasswordValid will be true or false
        console.log(isPasswordValid);
        if(!isPasswordValid){
            return res.status(400).json({message:"Password is Wrong"});
       }
        const token = jwt.sign(
            { id: user.id, role: user.role },     // payload hai yeh --- iisme vo data aata h jo token me store karana chahte hai
            process.env.JWT_SECRET,               // secret key --- ye .env me milegi jee
            { expiresIn: "7d" }                   // options --- usually tell the expiry of oue token
        );
        console.log("token");
        console.log(token);
        console.log(typeof(token));
        user.token = token;

        await user.save();                        // db me user ke data ko update krdon jee

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error during login" });
    }
};

const logout = async (req, res) => {
    try {
        // req.user me middleware dalega data
        // req.user se current user ki id nikalkar , usko logout krunga
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.token = null;
        await user.save();
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Server error during logout" });
    }
};

// export krdon functions routes ke lie.
module.exports = { signup, login, logout };