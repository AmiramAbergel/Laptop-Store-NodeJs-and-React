const client = require('./redisConnector');

module.exports = async (req, res, next) => {
  try {
    const cookieSession = req.get('Authorization');

    if (!cookieSession) {
      const err = new Error('Cookie Session required!');
      err.status = 400;
      next(err);
    }

    const userId = cookieSession.split('somethingverysecure')[1].split('making')[0];

    const time = await client.ttl('tokens.' + userId);

    if (time < 0 && time !== -1) {
      const err = new Error('Validation error!');
      err.status = 400;
      next(err);
    }

    req.userId = userId;
    next();
  } catch (er) {
    next(er);
  }
};
