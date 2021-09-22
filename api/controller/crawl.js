const gbkRequest = require('../utils/gbkRequest')
const cheerio = require('cheerio')
const fse = require('fs-extra')
const sequelize = require('../model/index')
const log = require('../utils/log')
const getProjectInfo = async () => {
  let url = 'http://222.77.178.63:7002/result_new.asp?page2=210&xm_search=&zl_search=&gs_search=&pzs_search=&pzx_search=&SelectXZQ=&SelectBK='
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
  // await sequelize.models.Project.bulkCreate(list)

  let a = await insertProject(list, 210)

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

  let a = fse.output('a1.html', html)
  //
  // let $ = cheerio(html)
  // let res = await sequelize.models.DailySale.upsert()
}




module.exports = {
  getProjectInfo,
  getDailySale
}