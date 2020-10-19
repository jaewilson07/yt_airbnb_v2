const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    id: ID!
    email: String!
    userName: Date!
    createdAt: Date!
    loginCount: Int!
  }

  type AuthPayload {
    userId: ID!
    userName: String!
    refreshToken: String!
    accessToken: String!
    time: String!
  }

  type LogoutResponse {
    time: String
    isLoggedOut: Boolean!
  }

  input RegisterInput {
    userName: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  input LoginInput {
    userName: String
    password: String!
    email: String
  }

  extend type Query {
    currentUser: AuthPayload
  }

  extend type Mutation {
    registerUser(authInput: RegisterInput): AuthPayload!
    loginUser(authInput: LoginInput): AuthPayload!
    logoutUser: LogoutResponse!
  }
`;
