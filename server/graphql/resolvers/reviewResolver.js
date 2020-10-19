const { PubSub } = require('apollo-server');

const { updateRecord, deleteRecord } = require('../../mongoose/mongoose_utils');
const { createReview } = require('../controller/reviewController');

const { checkAuth } = require('../../utils/auth');

const { SUB, CRUD_Payload } = require('../constants');

module.exports = {
  Query: {
    getReviews: async (parent, args, { Reviews }) => {
      try {
        const reviews = await Reviews.find().sort({ createdAt: -1 });
        return reviews;
      } catch (err) {
        throw new Error(err);
      }
    },
    getReview: async (_, { id }, { Reviews }) => {
      const review = await Reviews.findById(id);
      console.log(review);

      if (review) {
        return review;
      } else {
        throw new Error('Post not found');
      }
    },
  },
  Mutation: {
    createReview: checkAuth(
      async (
        parent,
        { createReview: { listing_id, ...reviewFields } },
        { Reviews, pubsub, user },
        info
      ) => {
        const payload = await createReview(
          listing_id,
          reviewFields,
          user,
          Reviews
        );

        pubsub.publish(SUB.NEW_REVIEW, { postReview: review });

        return payload;
      }
    ),
    updateReview: checkAuth(
      async (
        parent,
        { updateReview: { listing_id: objectId, ...updateFields } },
        { Reviews, user }
      ) => {
        const payload = await updateRecord(
          objectId,
          updateFields,
          user,
          'reviewer_id',
          Reviews
        );

        return payload;
      }
    ),

    deleteReview: checkAuth(
      async (parent, { id: objectId }, { Reviews, user }, info) => {
        const payload = await deleteRecord(
          objectId,
          user,
          'reviewer_id',
          Reviews
        );

        return payload;
      }
    ),
  },

  Subscription: {
    postReview: {
      subscribe(parent, args, { pubsub }, info) {
        return pubsub.asyncIterator([SUB.NEW_REVIEW]);
      },
    },
  },
};
