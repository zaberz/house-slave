const sequelize = require('../model/index')
async function getDistricts() {
  let res = await sequelize.models.District.findAll()
  return res
}

async function getTodaySale() {
  let res = await sequelize.models.DailySale.findOne({
    order: [['id', 'DESC']]
  })
  return res
}

async function getTodayAvail() {
  return sequelize.models.DailyAvailable.findOne({
    order: [['id', 'DESC']]
  })
}

async function getProjectBySearch(query) {
  let defaultQuery = {
    // offset: '',
    limit: 10,
    page: 1,
    districtName: "鼓楼区"
  }
  query = {
    ...defaultQuery,
    ...query
  }
  let res = await sequelize.models.Project.findAndCountAll({
    where: {
      districtName: query.districtName
    },
    limit: query.limit,
    offset: (query.page -1)* query.limit,
    order: [['id', 'desc']]
  })
  return res
}

async function getProjectInfo(projectId) {
  let projectInfo = await sequelize.models.Project.findOne({
    where: {
      projectId
    }
  })
  let buildings = await sequelize.models.Building.findAll({
    where: {
      projectId
    }
  })
  return {
    projectInfo,
    buildings
  }
}

async function getBuildingInfo(buildingId) {

  let buildingInfo = await sequelize.models.Building.findOne({
    where: {buildingId}
  })
  let houseList = await sequelize.models.House.findAll({
    where: {
      buildingId
    }
  })

  return {
    buildingInfo,
    houseList
  }
}

module.exports = {
  getDistricts,
  getTodaySale,
  getTodayAvail,
  getProjectBySearch,
  getProjectInfo,
  getBuildingInfo
}