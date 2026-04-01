const express = require('express'); // use the express framework
const app = express(); // provide tools to app

app.use(express.json()); //it is a middleware which reads raw data which is in the form of string and convert it into object and store in req.body
let users = [];

// SIGNUP API
app.post('/signup', (req, res) => {
    console.log("---->",req.body);
    if (!req.body) {
        return res.send("No data sent");
    }
    const { email, password } = req.body;
    if (!email || !password) {
        return res.send("All fields required");
    }
    users.push({ email, password });
    res.send("Signup successful");
});

// LOGIN API
app.post('/login', (req, res) => {
    if (!req.body) {
        return res.send("No data sent");
    }
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.send("User not found");
    }
    if (user.password !== password) {
        return res.send("Invalid password");
    }
    res.send("Login successful");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});