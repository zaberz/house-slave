const sequelize = require('../model/index')
const gbkRequest = require('../utils/gbkRequest')
const cheerio = require('cheerio')
const fse = require('fs-extra')
const dayjs = require('dayjs')
const urlib = require("url");
const {encodeBase64, decodeBase64} = require('../utils/strUtil')

async function start() {
  /**
  * 1 获取最新预售证
  * */
  let curLength = await sequelize.models.Licence.count()
  let count = await getTotalLicence()
  // let curLength = 0
  // let count = 3154
  let delta = count - curLength
  console.log(curLength, count)
  while (delta > 0) {
    console.log('delta', delta)
    let page = Math.floor(delta / 15)
    let no = delta % 15
    if (no != 0) {
      page += 1
    }else{
      no = 15
    }
    let detail = await getLicenceDetail(page, no)

    let projectId = detail.projectId
    let licenceId = detail.licenceId
    let projectInfo = await getProjectInfo(projectId)
    let buildingList = await getBuildingList(projectId, licenceId)

    insertLicenceData(detail)
    insertProject(projectInfo)
    insertBuilding(buildingList)

    delta -= 1
  }
}

async function getTotalLicence() {
  let page = 1
  let url = `http://222.77.178.63:7002/result_new.asp?page2=${page}&xm_search=&zl_search=&gs_search=&pzs_search=&pzx_search=&SelectXZQ=&SelectBK=`
  let html = await cacheHtml(url, 'a0')
  let $ = cheerio.load(html)
  let info = $('body > table:nth-child(2) > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(33) > td')
  let a = info.text()
  let res = /查到记录共(\d+)条/.exec(a)
  let count = res[1]
  return count
}

async function getLicenceDetail(page, no) {
  let offset = 3
  let url = `http://222.77.178.63:7002/result_new.asp?page2=${page}&xm_search=&zl_search=&gs_search=&pzs_search=&pzx_search=&SelectXZQ=&SelectBK=`
  let html = await cacheHtml(url, 'a1')
  let $ = cheerio.load(html)
  let tbody = $('body > table:nth-child(2) > tbody > tr:nth-child(2) > td > table > tbody')
  let row = tbody.children().get(offset - 1 + no * 2 -1)
  let data = {}
  data.licenceNo = $($(row).children().get(0)).text().trim()
  data.projectId = '' // $($(row).children().get(1)).text().trim()
  data.projectName = $($(row).children().get(1)).text().trim()
  data.square = $($(row).children().get(2)).text().trim()
  data.building = $($(row).children().get(3)).text().trim()
  data.approvalDate = $($(row).children().get(4)).text().trim()
  data.completionDate = $($(row).children().get(5)).text().trim()

  let a = $($(row).children().get(1)).find('a').attr()
  if (a) {
    let href = a.href
    let pid = /proDetail\.asp\?projectID=(.+)/.exec(href)[1]
    let c = decodeBase64(pid)
    data.projectId = c.split('|')[0]
    data.licenceId = await getLicenceId(data.projectId, data.licenceNo)
    if (!data.licenceId) {
      throw new Error('licenceId not exist')
    }
    return data

  }else{
    throw new Error('projectId not exist')
  }
}

async function getLicenceId(projectId, licenceNo) {
  let t = dayjs().format('YYYY-M-DD|mm')
  let pstr = `${projectId}|${t}`
  pstr = encodeBase64(pstr)
  let url = `http://222.77.178.63:7002/Presell.asp?projectID=${pstr}`
  let html = await cacheHtml(url, 'a2')

  let $ = cheerio.load(html)
  let a = $('body > table > tbody')
  let children = a.children()
  for(let i = 0; i< children.length; i++) {
    let row = $(children[i])
    let k = $(row.children().get(0)).text().trim()
    if (k == licenceNo) {
      let href = row.children(0).find('a').attr().href
      let urlInfo = urlib.parse(href,true);
      return urlInfo.query.PreSell_ID
    }
  }
  return false
}



async function getProjectInfo(pid) {
  let t = dayjs().format('YYYY-M-DD|mm')
  let pstr = `${pid}|${t}`
  pstr = encodeBase64(pstr)
  let url =`http://222.77.178.63:7002/proDetail.asp?projectID=${pstr}`
  let html = await cacheHtml(url, 'a3')


  let $ = cheerio.load(html)
  let data = {}
  data.name = $('body > table:nth-child(3) > tbody > tr > td > table:nth-child(2) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td:nth-child(2)').text()
  data.districtName = $('body > table:nth-child(3) > tbody > tr > td > table:nth-child(2) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td:nth-child(4)').text()
  data.address = $('body > table:nth-child(3) > tbody > tr > td > table:nth-child(2) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td:nth-child(2)').text()
  data.companyName = $('body > table:nth-child(3) > tbody > tr > td > table:nth-child(2) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td:nth-child(2)').text()

  data.countSuite = $('#div1 > table > tbody > tr:nth-child(1) > td:nth-child(2)').text()
  data.countArea = $('#div1 > table > tbody > tr:nth-child(1) > td:nth-child(4)').text()
  data.countHouse = $('#div1 > table > tbody > tr:nth-child(1) > td:nth-child(6)').text()
  data.countHouseArea = $('#div1 > table > tbody > tr:nth-child(1) > td:nth-child(8)').text()

  data.availCountSuite = $('#div1 > table > tbody > tr:nth-child(2) > td:nth-child(2)').text()
  data.availCountArea = $('#div1 > table > tbody > tr:nth-child(2) > td:nth-child(4)').text()
  data.availCountHouse = $('#div1 > table > tbody > tr:nth-child(2) > td:nth-child(6)').text()
  data.availCountHouseArea = $('#div1 > table > tbody > tr:nth-child(2) > td:nth-child(8)').text()

  data.soldCountSuite = $('#div1 > table > tbody > tr:nth-child(4) > td:nth-child(2)').text()
  data.soldCountArea = $('#div1 > table > tbody > tr:nth-child(4) > td:nth-child(4)').text()
  data.soldCountHouse = $('#div1 > table > tbody > tr:nth-child(4) > td:nth-child(6)').text()
  data.soldCountHouseArea = $('#div1 > table > tbody > tr:nth-child(4) > td:nth-child(8)').text()
  data.isSoldout = data.availCountSuite == 0

  return data
}

async function getBuildingList(projectId, licenceId) {
  let t = dayjs().format('YYYY-M-DD|mm')
  let pstr = `${projectId}|${t}`
  pstr = encodeBase64(pstr)
  let url = `http://222.77.178.63:7002/building.asp?ProjectID=${pstr}&projectName=&PreSell_ID=${licenceId}&Start_ID=${licenceId}`
  let html = await cacheHtml(url, 'a4')
  let $ = cheerio.load(html)
  let tbody = $('body > table > tbody > tr > td > table > tbody > tr > td > table > tbody')
  let i = 1
  let length = tbody.children().length
  let list = []
  for (;i<length;i++) {
    let row = $(tbody.children().get(i))
    let data = {
    }
    data.isInit = false
    data.isSoldout = false
    data.projectId = projectId
    data.buildingName = $(row.children().get(0)).text().trim()
    let href = row.find('a').attr().href
    let urlInfo = urlib.parse(href, true)
    let p = urlInfo.query.Param
    let d = decodeBase64(p)
    data.buildingId = d.split('||')[0]
    list.push(data)
  }
  return list
}


async function insertLicenceData(data) {
  let res = await sequelize.models.Licence.create(data)
  return res
}
async function insertProject(data) {
  let res = await sequelize.models.Project.create(data)
  return res
}
async function insertBuilding(list) {
  let res = await sequelize.models.Building.bulkCreate(list)
  return res
}

async function insertHouse(list) {}


async function cacheHtml(url, fileName) {

  let html = await gbkRequest({url})
  fse.outputFile(`./${fileName}.html`,  html)
  // let html = await fse.readFile(`./${fileName}.html`, 'utf-8')
  return html
}
// start()


module.exports = {
  start
}