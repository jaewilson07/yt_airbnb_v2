const { Kind } = require('graphql/language');

const { makeExecutableSchema, gql } = require('apollo-server');
const { merge } = require('lodash');

const reviewResolvers = require('./resolvers/reviewResolver');
const hostResolvers = require('./resolvers/hostResolver');
const userResolvers = require('./resolvers/userResolver');

const host = require('./typedefs/hostTypeDef');
const review = require('./typedefs/reviewTypeDef');
const user = require('./typedefs/userTypeDef');
const { GraphQLScalarType, GraphQLUnionType } = require('graphql');

const baseTypeDef = gql`
  scalar Date

  union CRUD_Object = ReviewType

  type CRUD_Payload {
    objectID: ID
    createdAt: Date!
    isSuccess: Boolean!
    message: String!
    data: CRUD_Object
  }

  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }
`;

const baseResolver = {
  CRUD_Object: {
    __resolveType(obj, context, info) {
      if (obj.comments) {
        return 'ReviewType';
      }
      return null;
    },
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    parseValue(value) {
      return value.getTime(); // value from client
    },
    serialize(value) {
      return new Date(value); // value sent to the client
    },
    parseLiteral(ast) {
      if (async.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      return null;
    },
  }),
};

const schema = makeExecutableSchema({
  typeDefs: [baseTypeDef, review, host, user],
  resolvers: merge(baseResolver, reviewResolvers, hostResolvers, userResolvers),
});

module.exports = schema;
