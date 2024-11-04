const express = require('express')
const dotenv = require('dotenv')
const session = require('express-session')
const app = express()
const passport = require('passport')
dotenv.config()


require('./auth')  

app.use(session({ secret: 'aman', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get('/google/callback', 
  passport.authenticate('google', {
    successRedirect:'/protected',
    failureRedirect: '/auth/failure'
  }));

app.get('/auth/failure', (req, res) => {
  res.send('Something went wrong');
});


app.get('/protected', isLoggedIn, (req,res)=>{
  console.log(req.user)
  res.send(`hello ${req.user.displayName}`)
})

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
});

app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

app.listen(3000, ()=> console.log('Listening on port 3000'))