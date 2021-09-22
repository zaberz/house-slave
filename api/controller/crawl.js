const gbkRequest = require('../utils/gbkRequest')
const cheerio = require('cheerio')
const fse = require('fs-extra')
const sequelize = require('../model/index')
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




module.exports = {
  getProjectInfo,
  getDailySale
}