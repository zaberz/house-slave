function encodeBase64(str) {
  return Buffer.from(str).toString('base64')
}

function decodeBase64(str) {
  let b = Buffer.from(str, 'base64')
  return b.toString('utf-8')
}

module.exports = {
  encodeBase64,
  decodeBase64
}