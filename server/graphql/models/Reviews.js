const { model, Schema, ObjectId } = require('mongoose');

const reviewSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  listing_id: Number,
  reviewer_id: String,
  comments: String,
});

module.exports = model('reviews', reviewSchema);
