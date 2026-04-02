const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./Config/database');
const authRoutes = require('./routes/authRoutes');
dotenv.config();
const app = express();
app.use(express.json());
sequelize.sync({alter:true})
    .then(() => {
        console.log("Table Created");
    })
    .catch(err => {
        console.log(err);
    });
app.use('/api/auth', authRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});