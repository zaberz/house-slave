const sequelize = require('../model/index')

function log(tag, data) {
  return sequelize.models.Log.create({
    tag,
    detail: data
  })
}

module.exports = log