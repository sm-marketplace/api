import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';
import Prometheus from 'prom-client'
import { HOST, PORT } from './config.js';
import { handleHello, handleInfo, handleMe } from './handlers/common.js';
import { handleGetItemPinata, handleHealthPinata, handlePostItemPinata, handleSearchPinata } from './handlers/pinata.js';
import { cacheItem } from './middlewares/cache.js';
import { rateLimiter } from './middlewares/rateLimit.js';
// App
const app = express()

// Prometheus metrics
const metricsInterval = Prometheus.collectDefaultMetrics()
const httpRequestDurationMicroseconds = new Prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]  // buckets for response time from 0.1ms to 500ms
})

// Middlewares
// Runs before each requests
app.use((req, res, next) => {
  res.locals.startEpoch = Date.now()
  next()
})
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
app.get('/metrics', (req, res) => {
  res.set('Content-Type', Prometheus.register.contentType)
  res.end(Prometheus.register.metrics())
})


// Runs after each requests
app.use((req, res, next) => {
  const responseTimeInMs = Date.now() - res.locals.startEpoch
  httpRequestDurationMicroseconds
    .labels(req.method, req.route?.path || req.path, res.statusCode)
    .observe(responseTimeInMs)
  next()
})

const server = app.listen(PORT, HOST, () => {
  console.log(`Listening on port ${HOST}:${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  clearInterval(metricsInterval)

  server.close((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    process.exit(0)
  })
})
