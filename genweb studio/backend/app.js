const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require("./routers/userRoutes");
const passport = require("passport");
const cors = require("cors");
const projectRoutes = require('./routers/projectRoutes');
require('./config/passport');
const authRoutes = require('./routers/auth');
const session = require('express-session');
require('dotenv').config();
const chatRoutes = require('./routers/chatRoutes');
const User = require('./models/userModel');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(
  session({
    secret: process.env.SECRETKEY || "genweb_studio_session_secret_default_key",
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Bridge session user to req.user for Firebase Auth compatibility
app.use((req, res, next) => {
  if (!req.user && req.session && req.session.user) {
    req.user = req.session.user;
  }
  next();
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'GenWeb Studio Backend API is running' });
});

app.use("/auth", authRoutes);
app.use('/user', userRoutes);
app.use('/project', projectRoutes);
app.use('/chat', chatRoutes);

app.get('/search', async (req, res) => {
  try {
    const users = await User.find({}, "_id name email");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users", details: error.message });
  }
});

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/genweb_studio";
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB (GenWeb Studio)'))
  .catch((err) => console.error('MongoDB connection error:', err));

process.on('uncaughtException', (err) => {
  console.error('[GenWeb Backend] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[GenWeb Backend] Unhandled Rejection at:', promise, 'reason:', reason);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`GenWeb Studio backend server running on port ${PORT}`));
