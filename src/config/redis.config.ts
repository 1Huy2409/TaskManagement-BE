// /utils/redis.js

import Redis from "ioredis";
  const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

redisClient.on('connect', () => {
  console.log('✅ Đã kết nối thành công đến Redis!');
});

redisClient.on('error', (err) => {
  console.error('❌ Lỗi kết nối Redis:', err); 
});

export default redisClient;