'use strict';

const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, 'www')))

const PORT = process.env.PORT || 8080

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'www/index.html'))
})

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
})

module.exports = app
