const { AuthenticationError } = require('apollo-server');

const jwt = require('jsonwebtoken');

SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || 12);
ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;
REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

JWT_EXPIRY = parseInt(process.env.JWT_EXPIRY);

const parseCookie = (req) => {
  let cookie = req.headers.cookie;

  cookie_obj = cookie.split(';').reduce((accum, cookie_str) => {
    let t = cookie_str.split('=');
    t = t.map((text) => text.trim());

    accum[t[0]] = t[1];
    return accum;
  }, {});

  return cookie_obj;
};

const checkAuth = (resolver) => {
  return async function (parent, args, context, info) {
    const cookies = parseCookie(context.req);

    accessToken = cookies['access-token'];
    refreshToken = cookies['refresh-token'];

    if (!accessToken && !refreshToken) {
      throw new AuthenticationError('User must signin');
    }

    if (accessToken) {
      try {
        const authUser = jwt.verify(accessToken, ACCESS_SECRET_KEY);

        return resolver(root, args, { ...context, user: authUser }, info);
      } catch (err) {
        console.log('access token expired will try to refresh');
      }
    }

    try {
      const authUser = jwt.verify(refreshToken, REFRESH_SECRET_KEY);

      dbUser = await context.Users.findById(authUser.userId);

      if (dbUser && dbUser.loginCount === authUser.loginCount) {
        const { authPayload, res } = signUserWithToken(dbUser, context.res);

        return resolver(root, args, { ...context, user: authUser, res }, info);
      }
    } catch (err) {
      throw new AuthenticationError(err);
    }
  };
};

const signUserWithToken = (user, res) => {
  const authUser = {
    userId: user.id,
    userName: user.userName,
    time: new Date().toISOString(),
    loginCount: user.loginCount,
  };

  const accessToken = jwt.sign(authUser, ACCESS_SECRET_KEY, {
    expiresIn: JWT_EXPIRY,
  });

  console.log(user.loginCount);
  const refreshToken = jwt.sign(
    { ...authUser, loginCount: user.loginCount },
    REFRESH_SECRET_KEY,
    {
      expiresIn: '7d',
    }
  );

  res.cookie('access-token', accessToken);
  res.cookie('refresh-token', refreshToken);

  return {
    authPayload: {
      ...authUser,
      accessToken,
      refreshToken,
    },
    res,
  };
};

const invalidateTokenAndCookie = async (user, res) => {
  user.loginCount = user.loginCount ? (user.loginCount += 1) : 1;
  await user.save();

  res.clearCookie('access-token');
  res.clearCookie('refresh-token');

  return res;
};

module.exports = {
  signUserWithToken,
  checkAuth,
  invalidateTokenAndCookie,
};
