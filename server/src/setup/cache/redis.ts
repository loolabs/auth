import redis from 'redis'

export const Client = redis.createClient({
    url: `${process.env.CACHE_URL}`,
    password: `${process.env.CACHE_PASSWORD}`
})
