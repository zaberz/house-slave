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
  project: {
    type: DataTypes.INTEGER,
  },
  suite: {
    type: DataTypes.INTEGER
  },
  square: {
    type: DataTypes.FLOAT
  },
  districtName: {
    type: DataTypes.STRING
  }
})

const Project = sequelize.define('Project', {
  licenceNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
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