import redis from 'redis'

let redisClient: null | redis.RedisClient = null

export const RedisClient = () => {
  if (redisClient === null) {
    redisClient = redis.createClient({
      url: `${process.env.CACHE_URL}`,
      password: `${process.env.CACHE_PASSWORD}`,
    })
  }
  return redisClient
}
