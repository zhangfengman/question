let baseUrl = 'http://202.205.158.33:9091/question-app'
// let baseUrl = 'http://survey.umainland.hk/question-app'
// let baseUrl = 'http://192.168.1.101:9090/'
const isEmpty = function (val) {
  if (val === null || val === '') {
    return true
  }
}

export {
  baseUrl,
  isEmpty
}
