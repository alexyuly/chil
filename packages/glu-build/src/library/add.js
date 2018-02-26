const store = require('./utilities/store')

module.exports = store((state, action) => state + action)
