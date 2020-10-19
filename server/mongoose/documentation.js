const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || 12);
SECRET_KEY = process.env.SECRET_KEY;

const signup = async (
  root,
  { authInput: { userName, password, confirmPassword, email } },
  { User },
  info
) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = new UserModel({
    email,
    userName,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  });

  const res = await newUser.save();
  const token = jwt.sign(res, SECRET_KEY, { expiresIn: '1h' });
  return {
    token,
    user: res,
  };
};

const signin = async (
  root,
  { authInput: { userName, password, confirmPassword, email } },
  { User },
  info
) => {
  const user = await Users.findOne({ $or: [{ email }, { userName }] });
  if (!user) {
    throw new UserInputError('user does not exist', {
      errors: { userName: 'user does not exist' },
    });
  }
  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new UserInputError('invalid password', {
      errors: { password: 'Invalid Password' },
    });
  }

  const token = jwt.sign(res, SECRET_KEY, { expiresIn: '1h' });
  return {
    token,
    user,
  };
};
