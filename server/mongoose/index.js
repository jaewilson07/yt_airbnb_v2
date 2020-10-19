const dotenv = require('dotenv');
const mongoose = require('mongoose');

// test that dotenv loads
const result = dotenv.config({ path: '../../.env' });
if (result.error) {
  throw result.error;
}

// define Mongo connection string
const USER_NAME = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_DATABASE;

const MONGO_URI = `mongodb+srv://${USER_NAME}:${PASSWORD}@cluster0.5v4rc.gcp.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

mongoose.set('debug', true);
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected');
    let db = mongoose.connection.db;

    return db.collection('reviews2').rename('reviews');
  })
  .then(() => {
    mongoose.disconnect();
  });
