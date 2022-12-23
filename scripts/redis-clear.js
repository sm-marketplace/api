import { redisClient } from "../src/redis.js";

await redisClient.flushDb()
.then(
  succeeded => {
    console.log("Redis Flush")
    console.log(succeeded? "Success.":"Error."); // will be true if successfull
  })
.catch((err) => {
  //handle error here
  console.log(err);
});

redisClient.disconnect();