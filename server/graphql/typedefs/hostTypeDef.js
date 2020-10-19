const { gql } = require('apollo-server');

module.exports = gql`
  type Host {
    id: ID!
    url: String
    name: String
    location: String
    about: String
    response_time: String
    thumbnail_url: String
    picture_url: String
    neighbourhood: String
    is_superhost: Boolean
    has_profile_pic: Boolean
    identity_verified: Boolean
    verifications: [String]
  }

  input SearchHost {
    field: String!
    value: String!
  }

  extend type Query {
    getHosts: [Host]
    searchHost(searchHost: SearchHost): Host
  }

  extend type Mutation {
    createHost(
      id: ID
      userId: ID
      name: String
      location: String
      about: String
      neighbourhood: String
    ): Host!
  }
`;
