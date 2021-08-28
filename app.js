const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, 'www')))

const port = 80

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'www/index.html'))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
