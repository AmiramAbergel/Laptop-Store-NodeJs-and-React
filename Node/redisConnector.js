// Using ioredis and with Async/Await
var Redis = require('ioredis');

const client = new Redis();
const check = async () => {
  try {
    await client.ping();
    console.log('Redis connected...');
  } catch (err) {
    console.log('Redis error: ', e);
  }
};
check();

module.exports = client;
