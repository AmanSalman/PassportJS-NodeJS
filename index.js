const express = require('express')
const dotenv = require('dotenv')
const session = require('express-session')
const app = express()
const passport = require('passport')
const mongoose = require('mongoose');

dotenv.config()


const User = require('./models/User');
require('./passport');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB:', err));


app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});


app.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users from the database
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});


const providers = ['google', 'facebook', 'apple'];
providers.forEach((provider) => {
  app.get(`/${provider}`, passport.authenticate(provider, { scope: ['email', 'profile'] }));
  app.get(
    `/${provider}/callback`,
    passport.authenticate(provider, {
      successRedirect: '/auth/success',
      failureRedirect: '/auth/failure',
    })
  );
});

// Optional: Success and Failure Routes
app.get('/success', (req, res) => {
  res.status(200).json({ message: 'Successfully authenticated!' });
});

app.get('/failure', (req, res) => {
  res.status(400).json({ message: 'Authentication failed.' });
});

app.listen(3000, ()=> console.log('Listening on port 3000'))


