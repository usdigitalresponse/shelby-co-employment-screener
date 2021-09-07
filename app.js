'use strict';

const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, 'www')))

var bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: true }));

// These cause a warning when the server starts up, but seem to work fine (for now).
// "body-parser deprecated undefined extended: provide extended option app.js:..."
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

const PORT = process.env.PORT || 8080

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'www/index.html'))
})

app.post('/sendemails', (req, res) => {
//  console.log(JSON.stringify(req.body))
})

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
})

module.exports = app
