module.exports = {
  SUB: { NEW_REVIEW: 'NEW_REVIEW' },

  REFRESH_TOKEN_COOKIE_OPTIONS: {
    httpOnly: true,
    path: '/',
    sameSite: true,
  },
  CRUD_Payload: function (
    objectId = null,
    isSuccess = false,
    data = null,
    message = null
  ) {
    this.objectId = objectId;
    this.createdAt = Date.now();
    this.isSuccess = isSuccess;
    this.message = message;
    this.data = data;
  },
};
