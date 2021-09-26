const gbkRequest = require('../utils/gbkRequest')
const cheerio = require('cheerio')
const fse = require('fs-extra')
const sequelize = require('../model/index')
const {DataTypes} = require('sequelize')
const log = require('../utils/log')
const dayjs = require('dayjs')



const getProjectInfo = async () => {

  let page = await sequelize.models.Log.findOne({
    where: {
      tag: 'getproject'
    },
    order: [['id', 'DESC']]
  })
  let pNo = page.detail

  while (pNo > 1) {
    let list = await getDataByPage(pNo-1)
    let a = await insertProject(list, pNo-1)
    pNo -= 1
  }

  return ''
}

async function getDataByPage(page) {
  let url = `http://222.77.178.63:7002/result_new.asp?page2=${page}&xm_search=&zl_search=&gs_search=&pzs_search=&pzx_search=&SelectXZQ=&SelectBK=`
  let html = await gbkRequest({
    url,
    method: 'get'
  })

  // let html = await fse.readFile('./t.html', 'utf-8')
  let $ = cheerio.load(html)
  let lineInfo = $('body > table:nth-child(2) > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(4)')
  let list = []
  while (lineInfo && lineInfo.length) {
    let res = createInfo(lineInfo)
    if (res) {
      list.push(res)
    }
    lineInfo = lineInfo.next()
  }

  function createInfo(line) {
    let children = line.children()
    if (children.length !== 6) {
      return false
    }
    let a = $(children[1]).find('a').attr()
    let projectID = ''
    if (a) {
      let href = a.href
      projectID = /proDetail\.asp\?projectID=(.+)/.exec(href)[1]
    }

    let approvalDate = new Date( $(children[4]).text().trim()).getTime() || null
    let completionDate = new Date( $(children[5]).text().trim()).getTime() || null
    return {
      licenceNo: $(children[0]).text().trim(),
      projectId: projectID,
      projectName: $(children[1]).text().trim(),
      square: $(children[2]).text().trim(),
      building: $(children[3]).text().trim(),
      approvalDate,
      completionDate,
    }
  }

  return list
}


async function insertProject(saveData, page) {
  let lastId = 0
  let lastData = await sequelize.models.Project.findOne({
    order: [
      ['licenceNo', 'DESC']
    ]
  })
  if (lastData) lastId = lastData.licenceNo
  if (lastId) {
    saveData = saveData.filter(item=> item.licenceNo > lastId)
  }
  saveData.sort((a,b)=> {
    return a.licenceNo > b.licenceNo ? 1 :-1
  })
  await sequelize.models.Project.bulkCreate(saveData)
  await log('getproject', page)
}


const getDailySale = async () => {
  let url = 'http://222.77.178.63:7002/qrqy.asp'
  let html = await gbkRequest({
    url
  })
  // let a = fse.outputFile('a1.html', html)
  // let html = fse.readFileSync('./a1.html', 'utf-8')
  let $ = cheerio.load(html)
  let a = $('body > table > tbody > tr:nth-child(2)')
  let res = []

  while (a && a.length>0) {
    let children = a.children()
    res.push({
      area: $(children[0]).text().trim(),
      suite: $(children[1]).text().trim(),
      square: $(children[2]).text().trim()
    })
    a = a.next()
  }

  let now = +new Date()

  let b = await sequelize.models.DailySale.create({
    day: now,
    detail: res
  })
  return b
  // let res = await sequelize.models.DailySale.upsert()
}

const getDailyAvail = async () => {
  let url = 'http://222.77.178.63:7002/qrks.asp'
  let html = await gbkRequest({
    url
  })
  // let a = fse.outputFile('a1.html', html)
  // let html = fse.readFileSync('./a1.html', 'utf-8')
  let $ = cheerio.load(html)
  let a = $('body > table > tbody > tr:nth-child(2)')
  let res = []

  while (a && a.length>0) {
    let children = a.children()
    res.push({
      area: $(children[0]).text().trim(),
      project: $(children[1]).text().trim(),
      suite: $(children[2]).text().trim(),
      square: $(children[3]).text().trim()
    })
    a = a.next()
  }

  let now = +new Date()

  let b = await sequelize.models.DailyAvailable.create({
    day: now,
    detail: res
  })
  return b
}

const getProjectDetail = async () => {
  return await getProjectDetailById(-99999602)
}

async function getProjectDetailById(pid) {
  let t = dayjs().format('YYYY-M-DD|mm')
  let pstr = `${pid}|${t}`
  pstr = Buffer.from(pstr).toString('base64')
  let url =`http://222.77.178.63:7002/proDetail.asp?projectID=${pstr}`
  let html = await gbkRequest({url})
  let $ = cheerio.load(html)
  let data = {
    // name: DataTypes.STRING,
    // districtName: DataTypes.STRING,
    // address: DataTypes.STRING,
    // companyName: DataTypes.STRING,
    //
    // countSuite: DataTypes.INTEGER,
    // countArea: DataTypes.FLOAT,
    // countHouse: DataTypes.INTEGER,
    // countHouseArea: DataTypes.FLOAT,
    //
    // availCountSuite: DataTypes.INTEGER,
    // availCountArea: DataTypes.FLOAT,
    // availCountHouse: DataTypes.INTEGER,
    // availCountHouseArea: DataTypes.FLOAT,
    //
    // soldCountSuite: DataTypes.INTEGER,
    // soldCountArea: DataTypes.FLOAT,
    // soldCountHouse: DataTypes.INTEGER,
    // soldCountHouseArea: DataTypes.FLOAT,
    //
    // isSoldout: DataTypes.BOOLEAN
  }

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

module.exports = {
  getProjectInfo,
  getDailySale,
  getDailyAvail,
  getProjectDetail,
  getProjectDetailById
}