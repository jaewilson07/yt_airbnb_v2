const { model, Schema } = require('mongoose');

// use graphql to enforce required fields
const userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: Date,
  lastModified: {
    type: Date,
    default: Date.now(),
  },

  loginCount: {
    type: Number,
    default: 0,
  },
});

module.exports = model('users', userSchema);
