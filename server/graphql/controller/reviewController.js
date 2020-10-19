const { CRUD_Payload } = require('../constants');

const createReview = async (listing_id, reviewFields, user, Reviews) => {
  const existReview = await Reviews.findOne({
    $and: [{ reviewer_id: user.userId }, { listing_id }],
  });

  if (existReview) {
    return new CRUD_Payload(
      ...{
        objectId: existReview.id,
        isSuccess: false,
        data: existReview,
        message: 'This reviewer already reviewed this listing',
      }
    );
  }

  const payload = await createRecord(
    {
      listing_id,
      reviewer_id: user.userId,
      ...reviewFields,
    },
    Reviews
  );

  return payload;
};

module.exports = { createReview };
