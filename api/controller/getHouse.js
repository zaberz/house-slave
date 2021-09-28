const sequelize = require('../model/index')
const gbkRequest = require('../utils/gbkRequest')
const cheerio = require('cheerio')
const fse = require('fs-extra')
const dayjs = require('dayjs')
const urllib = require("url");
const {encodeBase64, decodeBase64} = require('../utils/strUtil')

async function getHouseByBuilding() {
  let buildingInfo = await sequelize.models.Building.findOne({
    where: {
      isInit: false
    },
    offset: 0,
    order: [['id', 'asc']]
  })
  while (buildingInfo) {
    console.log('start buildingId:', buildingInfo.id,'-', buildingInfo.buildingId)
    let list = await getList(buildingInfo)

    let t = await sequelize.transaction();
    try{
      await sequelize.models.House.bulkCreate(list, {transaction: t})
      buildingInfo.isInit = true
      await buildingInfo.save({transaction: t})
      await t.commit();
    }catch (e) {
      await t.rollback();
      throw e
    }

    buildingInfo = await sequelize.models.Building.findOne({
      where: {
        isInit: false
      },
      offset: 0,
      order: [['id', 'asc']]
    })
  }

}

async function getList (buildingInfo) {
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
  let html = await gbkRequest({url})
  fse.outputFile(`./${fileName}.html`,  html)
  // let html = await fse.readFile(`./${fileName}.html`, 'utf-8')
  return html
}

module.exports = {
  getHouseByBuilding
}