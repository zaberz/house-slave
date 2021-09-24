require("dotenv").config();
const sequelize = require('./model/index')

async function gId() {
  let length = await sequelize.models.Project.count()
  let i = 1

  while (i < 10) {
    let a = await sequelize.models.Project.findByPk(i)
    let pid = a.projectId
    let b = Buffer.from(pid, 'base64')
    let c = b.toString('ascii')
    let d = c.split('|')[0]
    console.log(d)
    a.projectRealId = d
    a.save()
    i++
  }
}

gId()