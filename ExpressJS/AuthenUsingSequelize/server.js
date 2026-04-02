const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./Config/database');
const authRoutes = require('./routes/authRoutes');
dotenv.config();
const app = express();
app.use(express.json());
sequelize.sync({alter:true})
app.use('/api/auth', authRoutes);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});