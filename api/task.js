require("dotenv").config();
const sequelize = require('./model/index')
const {getProjectDetailById} = require('./controller/crawl')
const dayjs = require('dayjs')
const urllib = require("url");
const {encodeBase64, decodeBase64} = require('./utils/strUtil')
const gbkRequest = require('./utils/gbkRequest')
const {Op} = require('sequelize')
const cheerio = require('cheerio')
const fse = require('fs-extra')

async function gId() {
  let length = await sequelize.models.Project.count()
  let i = 1

  while (i < 10) {
    let a = await sequelize.models.Project.findByPk(i)
    let pid = a.projectId
    let b = Buffer.from(pid, 'base64')
    let c = b.toString('ascii')
    let d = c.split('|')[0]
    a.projectRealId = d
    a.save()
    i++
  }
}

async function a() {
  let length = await sequelize.models.Project.count()
  let i = 1
  while (i < length) {
    let a = await sequelize.models.Project.findByPk(i)
    let pid = a.projectRealId
    console.log(pid)
    let c = await sequelize.models.ProjectDetail.findOrCreate({
      where: {
        projectId: pid
      }
    })
    if(c[1]) {
      console.log('c')
    }
    i++
  }
}

async function b() {
  let i = 1
  let length = await sequelize.models.ProjectDetail.count()
  while (i) {
    let res = await sequelize.models.ProjectDetail.findByPk(i)
    if (res) {
      console.log(i)
      let pid = res.projectId
      let data = await getProjectDetailById(pid)
      await sequelize.models.ProjectDetail.update(data, {
        where: {
          id: i
        }
      })
    }else{
      i=-1
    }
    i++
  }
}

// a()


async function recover() {
  let cur = 0
  let total = await sequelize.models.Licence.count()
  while (cur<1) {
    console.log(cur)
    let licenceInfo = await sequelize.models.Licence.findOne({
      offset: cur
    })
    let {projectId, licenceId} = licenceInfo

    let t = dayjs().format('YYYY-M-DD|mm')
    let pstr = `${projectId}|${t}`
    pstr = encodeBase64(pstr)
    let url = `http://222.77.178.63:7002/building.asp?ProjectID=${pstr}&projectName=&PreSell_ID=${licenceId}&Start_ID=${licenceId}`


    let html = await gbkRequest({url})
    let $ = cheerio.load(html)
    let tbody = $('body > table > tbody > tr > td > table > tbody > tr > td > table > tbody')
    let i = 1
    let length = tbody.children().length
    let list = []
    for (;i<length;i++) {
      let row = $(tbody.children().get(i))
      let data = {}
      data.isInit = false
      data.isSoldout = false
      data.licenceId = licenceId
      data.projectId = projectId
      data.buildingName = $(row.children().get(0)).text().trim()
      let href = row.find('a').attr().href
      let urlInfo = urlib.parse(href, true)
      let p = urlInfo.query.Param
      let d = decodeBase64(p)
      data.buildingId = d.split('||')[0]
      list.push(data)
    }

    let bids = list.map(item => item.buildingId)

    console.log(bids)

    await sequelize.models.Building.update({
      licenceId
    }, {
      where: {
        buildingId: {
          [Op.in]: bids
        }
      }
    })

    cur++
  }
}

async function getBuildings() {

  let buildingInfo = await sequelize.models.Building.findOne({
    offset: 0,
    order: [['id', 'asc']]
  })
  let {projectId, licenceId, buildingId} = buildingInfo
  let pstr = encodeBase64(projectId)
  let param = encodeBase64(`${buildingId}||${dayjs().format('YYYY/M/DD hh:mm:ss')}`)
  let url = `http://222.77.178.63:7002/House.asp?ProjectID=${pstr}&projectName=&PreSell_ID=${licenceId}&Start_ID=${licenceId}&bname=34%23%C2%A5&Param=${param}`
  let html = await cacheHtml(url, 'a11')
  let $ = cheerio.load(html)
  let tbody = $('#Table1 > tbody > tr > td > table:nth-child(2) > tbody')
  let list = []
  let floors = tbody.children()
  for(let floor of floors) {
    let floorNum = $($(floor).children().get(0)).text().trim()
    let floorHouseList = []
    let countHouse = $(floor).children().length
    for (let i =1; i< countHouse;i++) {
      let data = {
        // licenceId,
        // projectId,
        // buildingId,
      }
      data.floor = floorNum
      let houseDom = $($(floor).children().get(i))
      data.houseName = houseDom.text().trim()
      let aTag = houseDom.find('a')
      if (aTag.length > 0) {
        let href = $(aTag).attr().href
        let urlInfo = urllib.parse(href, true)
        data.houseId = decodeBase64( urlInfo.query.Param).split('|')[0] || ''
        console.log(data.houseId)
      }
      let statusMap = {
        '#FF3399': '已签',
        '#FF0000': '已登记',
        '#00FF00': '可售',
        '#9999FF': '抵押',
        '#FFFF00': '限制',
        '#FFFFFF': '未纳入网上销售',
      }
      // 1422360|151872
      let bgcolor = houseDom.attr().bgcolor
      data.status = statusMap[bgcolor] || '未知'
      let title = houseDom.attr().title
      let regx = /([\d\.])+/g
      let res = title.match(regx)
      data.pBuildingSquare = res[0] || 0
      data.rBuildingSquare = res[1] || 0
      data.isInit = false
      floorHouseList.push(data)
    }
    list.push(...floorHouseList)
  }
  return list
}

async function cacheHtml(url, fileName) {

  // let html = await gbkRequest({url})
  // fse.outputFile(`./${fileName}.html`,  html)
  let html = await fse.readFile(`./${fileName}.html`, 'utf-8')
  return html
}

getBuildings()
