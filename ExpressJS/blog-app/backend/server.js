const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { sequelize } = require('./models/Index');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes')
const likeRoutes = require('./routes/likeRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT;
const startServer = async () => {
  try {
    await sequelize.sync();
    console.log("Database connected and synced");
    app.listen(5000, () => {
      console.log("Server running...");
    });
  } catch (err) {
    console.error("DB connection failed:", err);
  }
};

startServer();