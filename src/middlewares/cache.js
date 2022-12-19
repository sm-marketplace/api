import { redisClient } from "../redis.js";

export async function cacheItem(req, res, next) {
  const hash = req.params['hash'];  
  let item;
  try {
    const cacheResults = await redisClient.get(hash);
    if (cacheResults) {
      item = JSON.parse(cacheResults);
      res.send({
        fromCache: true,
        status: true,
        itemFound: item != undefined,
        item
      });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(404);
  }
}