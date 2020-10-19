const dotenv = require('dotenv');
const { ApolloServer, PubSub, gql } = require('apollo-server');
const mongoose = require('mongoose');

const model = require('./server/graphql/models/model');

// test that dotenv loads
const result = dotenv.config();
if (result.error) {
  throw result.error;
}

const schema = require('./server/graphql/schema');

// define Mongo connection string
const USER_NAME = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_DATABASE;

const MONGO_URI = `mongodb+srv://${USER_NAME}:${PASSWORD}@cluster0.5v4rc.gcp.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const pubsub = new PubSub();

const server = new ApolloServer({
  schema,
  context: ({ req, res }) => ({ req, res, ...model, pubsub }),
});

const PORT = process.env.SERVER_PORT;
console.log(PORT);

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to MongoDB');
    return server.listen(PORT);
  })
  .then((res) => console.log(`server running at ${res.url}`));
