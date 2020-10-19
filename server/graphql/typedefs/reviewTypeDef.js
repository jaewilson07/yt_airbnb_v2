const { gql } = require('apollo-server');

module.exports = gql`
  type ReviewType {
    id: ID
    createdAt: Date
    updatedAt: Date
    listing_id: ID!
    reviewer_id: ID
    comments: String!
  }

  input SearchReview {
    field: String!
    value: String!
  }

  input CreateReview {
    listing_id: ID!
    comments: String!
  }

  input UpdateReview {
    listing_id: ID!
    comments: String!
  }

  extend type Query {
    getReviews: [ReviewType]
    getReview(id: ID!): ReviewType
    searchReview(searchReview: SearchReview): ReviewType
  }

  extend type Subscription {
    postReview: ReviewType
  }

  extend type Mutation {
    createReview(createReview: CreateReview): CRUD_Payload!
    updateReview(updateReview: UpdateReview): CRUD_Payload!
    deleteReview(id: ID!): CRUD_Payload!
  }
`;
