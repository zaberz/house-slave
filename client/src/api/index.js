import request from '../libs/request'

export function district() {
  return request({
    url: '/district'
  })
}
export function todaysale() {
  return request({
    url: '/todaysale'
  })
}
export function todayavail() {
  return request({
    url: '/todayavail'
  })
}
export function searchproject(params) {
  return request({
    url: '/searchproject',
    params
  })
}
export function project(id) {
  return request({
    url: `/project/${id}`
  })
}
export function building(id) {
  return request({
    url: `/building/${id}`
  })
}