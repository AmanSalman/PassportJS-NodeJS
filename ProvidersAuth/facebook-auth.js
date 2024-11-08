import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Use FacebookStrategy with the email scope included
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET_KEY,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'email'],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        console.log(profile);
        return done(null, profile);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

router.get('/', passport.authenticate('facebook', { scope: ['email'] }));

router.get(
  '/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/auth/facebook/error',
  }),
  function (req, res) {
    res.redirect('/auth/facebook/success');
  }
);

router.get('/success', (req, res) => {
  if (req.user) {
    const userInfo = {
      id: req.user.id,
      displayName: req.user.displayName,
      provider: req.user.provider,
      email: req.user.emails && req.user.emails[0] ? req.user.emails[0].value : 'No email provided',
    };
    res.json({ message: 'success', userInfo });
  } else {
    res.status(401).json({ message: 'User not authenticated' });
  }
});

router.get('/error', (req, res) => res.send('Error logging in via Facebook..'));

router.get('/signout', (req, res) => {
  try {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy(() => {
        res.redirect('/');
      });
    });
  } catch (err) {
    res.status(400).send({ message: 'Failed to sign out fb user' });
  }
});

export default router;
