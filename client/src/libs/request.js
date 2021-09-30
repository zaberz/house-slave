import CONFIG from '../config'
export default function request(opt) {
  opt.params = opt.params || {}
  opt.params.ts = Date.now()
  let a = {
    url: CONFIG.DOMAIN + opt.url + getParamsStr(opt.params),
    method: opt.method,
    header: opt.headers,
    data: opt.data
  }
  return new Promise((resolve, reject)=> {
    uni.request({
      ...a,
      success: (response) => {
        resolve(response.data)
      },
      fail: (err)=> {
        console.error(err)
        reject(err)
      }
    })
  })
}

function getParamsStr(params = {}) {
  let str = Object.keys(params)
    .map(
      (key) =>
        params[key] &&
        `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join('&')
  if (str) {
    return `?${str}`
  }else {
    return ''
  }
}