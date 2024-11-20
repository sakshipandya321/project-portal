
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import your User model

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'username' }, // Match with 'username' field in login form
      async (username, password, done) => {
        try {
          // Find the user by username
          const user = await User.findOne({ username });
          if (!user) {
            return done(null, false, { message: 'User not found' });
          }

          // Match the password
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Incorrect password' });
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Serialize user to store user ID in session
  passport.serializeUser((user, done) => done(null, user.id));

  // Deserialize user to retrieve user details from database
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};




