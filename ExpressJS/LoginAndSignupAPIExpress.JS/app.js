const express = require('express');
const app = express();
const authRoutes = require('./Routes/authRoutes');
app.use(express.json());
app.use('/', authRoutes);
module.exports = app;