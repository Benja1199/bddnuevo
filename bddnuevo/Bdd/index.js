const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Chupala Andre')
})

app.listen(3000)