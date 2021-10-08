let exec = require('child_process').exec

let a = exec('nodemon --watch api api/index.js ')
// let b = exec('cd client && npm run dev:mp-weixin')
let c = exec('cd client && npm run serve')

a.stdout.on('data', data=> {
  console.log(data);
})

a.stderr.on('data', data=> {
  console.log(data);
})
c.stdout.on('data', data=> {
  console.log(data);
})
c.stderr.on('data', data=> {
  console.log(data);
})
