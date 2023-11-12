const Redis = require("ioredis")

require('dotenv').config();
let redis_config = process.env.REDIS_CONFIG ? process.env.REDIS_CONFIG : '[{"port":6379,"host":"127.0.0.1"}]';
redis_config = JSON.parse(redis_config)
const redis = (redis_config.length > 1) ? new Redis.Cluster(redis_config) : new Redis(redis_config[0]);
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.EXPRESS_PORT ? process.env.EXPRESS_PORT : 3000;
const check_frequency = process.env.CHECK_FREQUENCY ? process.env.CHECK_FREQUENCY : 500;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/api/:queue_name', async (req, res) => {
    const result = await redis.lpush(req.params.queue_name, JSON.stringify(req.body))
    res.send(req.params.queue_name);
});


app.get('/api/:queue_name', async (req, res) => {
    let timeout = 10 * 1000
    if (req.query.timeout) {
        timeout = req.query.timeout
    }

    while (timeout > 0) {
        const result = await redis.rpop(req.params.queue_name)
        if (result) {
            res.send(result);
            return (result)
        }
        else {
            await new Promise(resolve => setTimeout(resolve, check_frequency));
            timeout = timeout - check_frequency;
        }
    }
    res.status(204);
    res.send();
    return (204)
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
