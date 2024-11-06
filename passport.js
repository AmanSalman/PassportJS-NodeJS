// dynamic way for multiple providers.

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as AppleStrategy } from 'passport-apple';
import { userModel } from '../models/User.js';

const strategies = [
  {
    name: 'google',
    Strategy: GoogleStrategy,
    options: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_Link}/auth/google/callback`,
    },
    profileHandler: (profile) => ({
      id: profile.id,
      username: profile.displayName,
      email: profile.emails[0].value,
    }),
  },
  {
    name: 'facebook',
    Strategy: FacebookStrategy,
    options: {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.API_Link}/auth/facebook/callback`,
      profileFields: ['id', 'emails', 'name'],
    },
    profileHandler: (profile) => ({
      id: profile.id,
      username: `${profile.name.givenName} ${profile.name.familyName}`,
      email: profile.emails ? profile.emails[0].value : null,
    }),
  },
  {
    name: 'apple',
    Strategy: AppleStrategy,
    options: {
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      callbackURL: `${process.env.API_Link}/auth/apple/callback`,
    },
    profileHandler: (profile) => ({
      id: profile.id,
      username: profile.name || profile.email,
      email: profile.email,
    }),
  },
];

strategies.forEach(({ name, Strategy, options, profileHandler }) => {
  passport.use(
    new Strategy(
      options,
      async (accessToken, refreshToken, profile, done) => {
        try {
          const userData = profileHandler(profile);
          let user = await userModel.findOne({ [`${name}Id`]: userData.id });
          if (!user) {
            user = new userModel({
              [`${name}Id`]: userData.id,
              username: userData.username,
              email: userData.email,
            });
            await user.save();
          }
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
});

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
