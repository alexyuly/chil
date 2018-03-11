const shortid = require('shortid')
const map = require('../factories/map')

module.exports = map(() => shortid.generate())
