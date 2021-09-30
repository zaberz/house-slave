const express = require('express')
const {getDistricts, getTodaySale, getTodayAvail, getProjectBySearch, getProjectInfo, getBuildingInfo} = require('../controller/wxapp')
const router = express.Router()
router.get('/', (req, res)=> {
  console.log(1)
  res.send({
    a:1
  })
})

router.get('/district', async (req, res)=> {
  let data = await getDistricts()
  res.json(data)
})
router.get('/todaysale', async (req, res)=> {
  let data = await getTodaySale()
  res.json(data)
})
router.get('/todayavail', async (req, res)=> {
  let data = await getTodayAvail()
  res.json(data)
})

router.get('/searchproject', async (req, res) => {
  let query = req.query
  let data = await getProjectBySearch(query)
  res.json(data)
})

router.get('/project/:projectId', async (req, res) => {
  let projectId = req.params.projectId
  let data = await getProjectInfo(projectId)
  res.json(data)
})

router.get('/building/:buildingId', async (req, res) => {
  let buildingId = req.params.buildingId
  let data = await getBuildingInfo(buildingId)
  res.json(data)
})

module.exports = router