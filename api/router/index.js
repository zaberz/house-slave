const express = require('express')
const {getProjectInfo} = require('../controller/crawl')
const router = express.Router()

router.get('/projectInfo', async function (req, res) {
  let html = await getProjectInfo()
  res.send({
    a:1
  })
  // res.json({
  //   a:1,
  //   b:2
  // })
})


module.exports = router