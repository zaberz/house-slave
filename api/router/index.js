const express = require('express')
const {getProjectInfo, getDailySale, getDailyAvail} = require('../controller/crawl')
const router = express.Router()

router.get('/projectInfo', async function (req, res) {
  let html = await getProjectInfo()
  res.send({
    a:1
  })
})
router.get('/getdailysale', async (req,res) => {
  let html = await getDailySale()
  res.send({
    msg: 'success'
  })
})

router.get('/availdailyavail', async (req, res) => {
  await getDailyAvail()
  res.send({
    msg: 'success'
  })
})


module.exports = router