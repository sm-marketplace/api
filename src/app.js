import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { HOST, PORT } from './config.js';
import { getItem, getItems, pinataUpload, testPinataAuth } from './pinata.js';
dotenv.config()

// set up rate limiter: maximum of five requests per minute
var limiter = rateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 5
});

const app = express()

// CodeQL: js/missing-rate-limiting
// apply rate limiter to all requests
app.use(limiter);

// enable files upload
app.use(fileUpload({
  createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.post('/upload-file', async (req, res) => {
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
});

app.get('/item/:hash', async (req, res) => {
  try {

    const hash = req.params['hash'];
    const item = await getItem(hash);

    res.send({
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
})

app.post('/search', async (req, res) => {
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
})

app.get('/health/pinata', async (req, res) => {
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


})

app.get('/info', (req, res) => {
  res.json({
    env: process.env.STAGE,
    version: "v1.0.0"
  })
})

app.get('/me', (req, res) => {
  res.json({
    name: "Roger Ramos Paredes",
    student: true,
    age: 24
  })
})

app.get('/', (req, res) => {
  res.json({
    msg: "Hello friend",
  })
})

app.listen(PORT, HOST, () => {
  console.log(`Listening on port ${HOST}:${PORT}`)
})