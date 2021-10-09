const sequelize = require('../model/index')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
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
    district: "鼓楼区",
    minPrice: 0,
    maxPrice: 9999999999,
    minSize: 0,
    maxSize: 99999999
  }
  query = {
    ...defaultQuery,
    ...query
  }

  let sql = `select * from "Projects" P where "districtName" = $district and P."projectId" in
(select "projectId" from "Houses" where "totalPrice" >= $minPrice and "totalPrice" <= $maxPrice
and "pBuildingSquare" >= $minSize and "pBuildingSquare" <= $maxSize
group by "projectId")
order by id desc
limit $limit
offset $offset 
;`

  let res = await sequelize.query(sql, {
    bind: {
      ...query,
      offset: (query.page -1)* query.limit,
    },
    raw: false,
    type: Sequelize.QueryTypes.SELECT
  })
  let countSql = `select count(*) from "Projects" P where "districtName" = $district and P."projectId" in
(select "projectId" from "Houses" where "totalPrice" >= $minPrice and "totalPrice" <= $maxPrice
and "pBuildingSquare" >= $minSize and "pBuildingSquare" <= $maxSize
group by "projectId")
;`
  let count = await sequelize.query(countSql, {
    bind: {
      ...query,
      offset: (query.page -1)* query.limit,
    },
    raw: false,
    plain: true,
    type: Sequelize.QueryTypes.SELECT
  })
  return {
    count: count.count,
    rows: res
  }
  // let res2 = await sequelize.models.Project.findAndCountAll({
  //   where: {
  //     districtName: query.district
  //   },
  //   limit: query.limit,
  //   offset: (query.page -1)* query.limit,
  //   order: [['id', 'desc']]
  // })
  // return res2
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