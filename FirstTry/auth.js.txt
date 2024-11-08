const GoogleStrategy = require('passport-google-oauth2').Strategy;
const passport = require('passport');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback: true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    try {
      // Check if user already exists in our database
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        // If not, create a new user
        user = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          profilePicture: profile.photos[0].value,
        });
        await user.save(); // Save user to database
      }

      return done(null, user); // Pass the user to the next middleware
    } catch (error) {
      return done(error, null);
    }
  }
));

// Serialize user instance to session
passport.serializeUser(function(user, done) {
  done(null, user.id); // Store only the user ID in the session
});

// Deserialize user from session
passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
