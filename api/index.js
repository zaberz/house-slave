/**
* vercel function entry
* */
require('dotenv').config()

const express = require('express')
const db = require('./model/index')
const router = require('./router/index')
let app = express()
app.get('/', (req, res)=> {
  res.json({
    a:1
  })
})

app.use('/crawl', router)

app.listen(9000)