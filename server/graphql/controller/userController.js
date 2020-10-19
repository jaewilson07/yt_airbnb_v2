const bcrypt = require('bcrypt');
const { UserInputError } = require('apollo-server');

const getUser = async ({ id, email, userName }, Users) => {
  const user = id
    ? await Users.findById(id)
    : await Users.findOne({ $or: [{ email }, { userName }] });

  if (!user) {
    throw new UserInputError('user does not exist', {
      errors: {
        userName: 'user does not exist',
      },
    });
  }
  return user;
};

const isValidUserPassword = async ({ password }, user) => {
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new UserInputError('invalid password', {
      errors: {
        password: 'Invalid Password',
      },
    });
  }
  return valid;
};

const createUser = async ({ userName, password, email }, UserModel) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = new UserModel({
    email,
    userName,
    password: hashedPassword,
    lastModified: new Date(),
    createdAt: new Date(),
  });

  return await newUser.save();
};

const isUserRegistered = async ({ userName, email }, Users) => {
  const existingUser = await Users.findOne({ $or: [{ userName }, { email }] });

  if (existingUser) {
    throw new UserInputError('User already registered', {
      errors: {
        userName: 'This user already registered',
      },
    });
  }

  return false;
};

module.exports = { createUser, isUserRegistered, isValidUserPassword, getUser };
