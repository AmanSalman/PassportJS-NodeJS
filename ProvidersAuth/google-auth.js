import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
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

router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/google/error',
  }),
  function (req, res) {
    res.redirect('/auth/google/success');
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

router.get('/error', (req, res) => res.send('Error logging in via Google..'));

router.get('/signout', (req, res) => {
  try {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy(() => {
        res.redirect('/');
      });
    });
  } catch (err) {
    res.status(400).send({ message: 'Failed to sign out Google user' });
  }
});

export default router;
