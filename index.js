require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const User = require('./models/user');
const Task = require('./models/task');
const authRoutes = require('./Routes/auth');
const taskRoutes = require('./Routes/tasks');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

// Middleware to authenticate the JWT token
function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Routes
app.use('/api', authRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
