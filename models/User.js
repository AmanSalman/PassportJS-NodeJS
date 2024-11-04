// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  displayName: String,
  email: String,
  profilePicture: String,
});

module.exports = mongoose.model('User', userSchema);
