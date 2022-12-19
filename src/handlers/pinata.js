import { REDIS_TTL } from "../config.js";
import { redisClient } from "../redis.js";
import { getItem, getItems, pinataUpload, testPinataAuth } from "../services/pinata.js";

export const handleHealthPinata = async (req, res) => {
  let pinataRes = undefined;
  try {
    pinataRes = await testPinataAuth();
  } catch (err) {
    pinataRes = err;
  }

  res.json({
    env: process.env.STAGE,
    auth: pinataRes
  })
} 

export const handleSearchPinata = async (req, res) => {
  try {

    const filters = req.body['filters'];
    const items = await getItems(filters);

    res.send({
      status: true,
      itemsFound: items.length,
      items,
    });

  } catch (err) {
    console.error(err)
    res.status(500).send({
      success: false,
      message: "An error has occurred" 
    });
  }
}

export const handleGetItemPinata = async (req, res) => {
  try {

    const hash = req.params['hash'];
    const item = await getItem(hash);

    await redisClient.set(hash, JSON.stringify(item), {
      EX: REDIS_TTL,
    });

    res.send({
      fromCache: false,
      status: true,
      itemFound: item != undefined,
      item
    });

  } catch (err) {
    console.error(err)
    res.status(500).send({
      success: false,
      message: "An error has occurred" 
    });
  }
}

export const handlePostItemPinata = async (req, res) => {
  try {
  
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
      return;
    }

    const file = req.files.file;
    const metadataStr = req.body['metadata'];
    const metadata = JSON.parse(metadataStr);

    // if (process.env.STAGE == 'LOCAL') {
    //   file.mv('./uploads/' + file.name);
    // };

    const pinataRes = await pinataUpload(file, file.name, metadata)

    //send response
    res.send({
      status: true,
      message: 'File is uploaded',
      data: {
        name: file.name,
        mimetype: file.mimetype,
        size: file.size
      },
      pinata: pinataRes,
      metadata
    });
  } catch (err) {
    console.error(err)

    if (err instanceof SyntaxError) {
      res.status(500).send({
        success: false,
        message: "metadata is not a valid json" 
      });
    }

    res.status(500).send({
      success: false,
      message: "An error has occurred" 
    });
  }
}