import express from 'express'
import passport from 'passport'
import dotenv from 'dotenv'
import session from 'express-session'
import mongoose from 'mongoose'
import facebookRouter from './ProvidersAuth/facebook-auth.js'
import googleRouter from './ProvidersAuth/google-auth.js'
dotenv.config()
const app = express()


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
  res.send(`
    <html>
      <head>
        <title>Authentication</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            text-align: center;
            padding: 20px;
            background-color: white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
          }
          h1 {
            color: #333;
          }
          a {
            display: inline-block;
            margin: 10px;
            padding: 10px 20px;
            background-color: #4285f4;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            transition: background-color 0.3s ease;
          }
          a:hover {
            background-color: #357ae8;
          }
          .facebook {
            background-color: #3b5998;
          }
          .facebook:hover {
            background-color: #2d4373;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Authenticate with Google or Facebook</h1>
          <a href="/auth/google">Authenticate with Google</a>
          <a href="/auth/facebook" class="facebook">Authenticate with Facebook</a>
        </div>
      </body>
    </html>
  `);
});

app.use('/auth/facebook', facebookRouter);
app.use('/auth/google', googleRouter);

app.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users from the database
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});


// const providers = ['google', 'facebook', 'apple'];
// providers.forEach((provider) => {
//   app.get(`/auth/${provider}`, passport.authenticate(provider, { scope: ['email', 'profile'] }));
//   app.get(
//     `/auth/${provider}/callback`,
//     passport.authenticate(provider, {
//       successRedirect: '/auth/success',
//       failureRedirect: '/auth/failure',
//     })
//   );
// });

// // Optional: Success and Failure Routes
// app.get('/auth/success', (req, res) => {
//   res.status(200).json({ message: 'Successfully authenticated!' });
// });

// app.get('/auth/failure', (req, res) => {
//   res.status(400).json({ message: 'Authentication failed.' });
// });

app.listen(3000, ()=> console.log('Listening on port 3000'))


