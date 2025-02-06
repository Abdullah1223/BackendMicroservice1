 const redis = require('ioredis')
 
 const RedisManager = new redis.Redis(
        'rediss://default:AVNS_xvg1g5mw1124APDNcD7@caching-197552da-normalcsgo21-4cff.e.aivencloud.com:28221'
 )
module.exports= RedisManager;

