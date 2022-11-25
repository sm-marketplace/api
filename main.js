require('dotenv').config()

const express = require('express')
const app = express()
const host = process.env.HOST
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/me', (req, res) => {
  res.json({
    name: "Roger Ramos Paredes",
    student: true,
    age: 24
  })
})

app.listen(port, host, () => {
  console.log(`Listening on port ${host}:${port}`)
})