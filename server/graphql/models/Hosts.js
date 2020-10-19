const { model, Schema, ObjectId } = require('mongoose');

const hostSchema = new Schema({
  url: String,
  name: String,
  location: String,
  about: String,
  response_time: String,
  thumbnail_url: String,
  picture_url: String,
  neighbourhood: String,
  is_superhost: Boolean,
  has_profile_pic: Boolean,
  identity_verified: Boolean,
  verifications: [String],
});

module.exports = model('hosts', hostSchema);
