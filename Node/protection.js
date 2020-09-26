const Redis = require('ioredis');

const { RateLimiterRedis } = require('rate-limiter-flexible');

const redisClient = new Redis({ enableOfflineQueue: false });

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 10, // 10 requests
  duration: 1, // per 1 second by IP
});

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter
      .consume(req.ip)
      .then(() => {
        next();
      })
      .catch(() => {
        res.status(429).send('Too Many Requests');
      });
};

module.exports = rateLimiterMiddleware;
