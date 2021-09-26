require("dotenv").config();
const sequelize = require('./model/index')
const {getProjectDetailById} = require('./controller/crawl')
async function gId() {
  let length = await sequelize.models.Project.count()
  let i = 1

  while (i < 10) {
    let a = await sequelize.models.Project.findByPk(i)
    let pid = a.projectId
    let b = Buffer.from(pid, 'base64')
    let c = b.toString('ascii')
    let d = c.split('|')[0]
    a.projectRealId = d
    a.save()
    i++
  }
}


async function a() {
  let length = await sequelize.models.Project.count()
  let i = 1
  while (i < length) {
    let a = await sequelize.models.Project.findByPk(i)
    let pid = a.projectRealId
    console.log(pid)
    let c = await sequelize.models.ProjectDetail.findOrCreate({
      where: {
        projectId: pid
      }
    })
    if(c[1]) {
      console.log('c')
    }
    i++
  }
}

async function b() {
  let i = 1
  let length = await sequelize.models.ProjectDetail.count()
  while (i) {
    let res = await sequelize.models.ProjectDetail.findByPk(i)
    if (res) {
      console.log(i)
      let pid = res.projectId
      let data = await getProjectDetailById(pid)
      await sequelize.models.ProjectDetail.update(data, {
        where: {
          id: i
        }
      })
    }else{
      i=-1
    }
    i++
  }
}

a()