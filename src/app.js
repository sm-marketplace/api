import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';
import { HOST, PORT } from './config.js';
import { handleHello, handleInfo, handleMe } from './handlers/common.js';
import { handleGetItemPinata, handleHealthPinata, handlePostItemPinata, handleSearchPinata } from './handlers/pinata.js';
import { cacheItem } from './middlewares/cache.js';
import { rateLimiter } from './middlewares/rateLimit.js';

const app = express()

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(fileUpload({ createParentPath: true })); // Enable files upload
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/upload-file', rateLimiter) // CodeQL: js/missing-rate-limiting
app.use('/search', rateLimiter) // CodeQL: js/missing-rate-limiting

// Routes
app.post('/upload-file', handlePostItemPinata);
app.post('/search', handleSearchPinata)
app.get('/item/:hash', cacheItem,  handleGetItemPinata)
app.get('/health/pinata', handleHealthPinata)
app.get('/info', handleInfo)
app.get('/me', handleMe)
app.get('/', handleHello)

app.listen(PORT, HOST, () => {
  console.log(`Listening on port ${HOST}:${PORT}`)
})