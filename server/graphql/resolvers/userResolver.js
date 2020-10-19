const {
  createUser,
  isUserRegistered,
  isValidUserPassword,
  getUser,
} = require('../controller/userController');

const {
  signUserWithToken,
  checkAuth,
  invalidateTokenAndCookie,
} = require('../../utils/auth');

module.exports = {
  Query: {
    currentUser: checkAuth((parent, args, { req, user }) => {
      return user;
    }),
  },

  Mutation: {
    registerUser: async (parent, { authInput }, { Users, res: _res }) => {
      try {
        if (!isUserRegistered(authInput, Users)) {
          const user = await createUser(authInput, Users);
          const { authPayload, res } = signUserWithToken(user, _res);
          return authPayload;
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    loginUser: async (parent, { authInput }, { Users, res: _res }) => {
      try {
        const user = await getUser(authInput, Users);

        if (isValidUserPassword(authInput, user)) {
          const { authPayload, res } = signUserWithToken(user, _res);
          return authPayload;
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    logoutUser: checkAuth(
      async (parent, args, { user: { userId }, Users, res: _res }) => {
        if (!userId) {
          return {
            isLoggedOut: false,
            time: Date.now(),
          };
        }

        const user = await getUser({ id: userId }, Users);

        const res = await invalidateTokenAndCookie(user, _res);

        return {
          isLoggedOut: true,
          time: Date.now(),
        };
      }
    ),
  },
};
