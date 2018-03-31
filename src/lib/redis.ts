const redis = require("redis");


export const publisher = redis.createClient({
    url: process.env.REDIS
});

export const subscriber = redis.createClient({
    url: process.env.REDIS
});
