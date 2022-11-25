import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import fileUpload from 'express-fileupload';
import cors from 'cors'
import bodyParser from 'body-parser';
import morgan from 'morgan';
import _ from 'lodash';
import { HOST, PORT } from './config.js';
import { pinataUpload, testPinataAuth } from './pinata.js';

const app = express()

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

    //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
    let file = req.files.file;

    if (process.env.STAGE == 'LOCAL') {
      //Use the mv() method to place the file in the upload directory (i.e. "uploads")
      file.mv('./uploads/' + file.name);
    }

    const pinataRes = await pinataUpload(file, file.name)

    //send response
    res.send({
      status: true,
      message: 'File is uploaded',
      data: {
        name: file.name,
        mimetype: file.mimetype,
        size: file.size
      },
      pinata: pinataRes
    });
  } catch (err) {
    console.error(err)
    res.status(500).send(err);
  }
});

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