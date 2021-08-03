import redis from 'redis'

export const RedisClient = redis.createClient({
  url: `${process.env.CACHE_URL}`,
  password: `${process.env.CACHE_PASSWORD}`
})
