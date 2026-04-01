let users = [];
// SIGNUP
exports.signup = (req, res) => {
    console.log("---->", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        return res.send("All fields required");
    }

    users.push({ email, password });
    res.send("Signup successful");
};

// LOGIN
exports.login = (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);

    if (!user) {
        return res.send("User not found");
    }

    if (user.password !== password) {
        return res.send("Invalid password");
    }

    res.send("Login successful");
};