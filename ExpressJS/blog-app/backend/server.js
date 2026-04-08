const express = require('express');
require('dotenv').config();

const { sequelize } = require('./models/Index');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes')
const likeRoutes = require('./routes/likeRoutes');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT;
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database connected and synced');
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('DB connection failed:', err.message);
    }); 