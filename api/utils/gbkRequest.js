const axios = require('axios')
const iconv = require('iconv-lite')

async function gbkRequest(option) {
  option.responseType= 'stream' // 以数据流的方式输出

  let res = await axios(option)
  return new Promise((resolve, reject)=> {
    const chunks = []
    res.data.on('data', chunk => {
      chunks.push(chunk)
    })

    res.data.on('end', () => {
      const buffer = Buffer.concat(chunks)
      const str = iconv.decode(buffer, 'gbk')
      resolve(str)
    })
  })
}

module.exports = gbkRequest