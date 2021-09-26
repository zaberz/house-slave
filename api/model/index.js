const {Sequelize, DataTypes} = require('sequelize')
const pg = require('pg')
// console.log(pg);
let dbName = process.env.DBNAME
let dbUser = process.env.DBUSER
let dbPWD = process.env.DBPWD
let dbHost = process.env.DBHOST
let dbPort = process.env.DBPORT
const sequelize = new Sequelize(dbName, dbUser, dbPWD, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: false
})

const District = sequelize.define('District', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  paranoid: true,
})

const DailySale = sequelize.define('DailySale', {
  day: {
    type: DataTypes.DATE,
  },
  detail: {
    type: DataTypes.JSON
  },
})

const DailyAvailable = sequelize.define('DailyAvailable', {
  day: {
    type: DataTypes.DATE,
  },
  detail: {
    type: DataTypes.JSON
  },
})

// DailyAvailable.sync({alter: true})

const Project = sequelize.define('Project', {
  licenceNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  projectRealId: DataTypes.STRING,
  projectId: {
    type: DataTypes.STRING,
  },
  projectName: {
    type: DataTypes.STRING,
  },
  square: {
    type: DataTypes.FLOAT,
  },
  building: {
    type: DataTypes.STRING,
  },
  approvalDate: {
    type: DataTypes.DATE,
  },
  completionDate: {
    type: DataTypes.DATE,
  }
})
// Project.sync({alter: true})

const ProjectDetail = sequelize.define('ProjectDetail', {
  date: DataTypes.DATE,
  projectId: {
    type:DataTypes.STRING,
    unique: true
  },
  name: DataTypes.STRING,
  districtName: DataTypes.STRING,
  address: DataTypes.STRING,
  companyName: DataTypes.STRING,

  countSuite: DataTypes.INTEGER,
  countArea: DataTypes.FLOAT,
  countHouse: DataTypes.INTEGER,
  countHouseArea: DataTypes.FLOAT,

  availCountSuite: DataTypes.INTEGER,
  availCountArea: DataTypes.FLOAT,
  availCountHouse: DataTypes.INTEGER,
  availCountHouseArea: DataTypes.FLOAT,

  soldCountSuite: DataTypes.INTEGER,
  soldCountArea: DataTypes.FLOAT,
  soldCountHouse: DataTypes.INTEGER,
  soldCountHouseArea: DataTypes.FLOAT,

  isSoldout: DataTypes.BOOLEAN
  // 总套数	1727	总面积	114,951	住宅套数	1069	住宅面积	90,298
  // 可售总套数	866	可售总面积	42,396	可售住宅套数	218	可售住宅面积	19,227
  // 预定总套数	0	预定总面积	0	预定住宅套数	0	预定住宅面积	0
  // 已售总套数	861	已售总面积	72,555	已售住宅套数	851	已售住宅面积	71,071
  // 已登记总套数	521	已登记总面积	46,591	已登记住宅套数	512	已登记住宅面积	45,273
})
// ProjectDetail.sync({alter: true})

const log = sequelize.define('Log', {
  tag: {
    type: DataTypes.STRING
  },
  detail: {
    type: DataTypes.STRING
  },
})

// sequelize.sync({force: true})
// sequelize.sync({alter: true})

module.exports = sequelize