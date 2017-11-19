const reducerClass = require('../runtime/reducerClass')
const { definePath } = require('../runtime/require')
const definition = definePath('./store')

const store = reducerClass(definition, (state) => state)

module.exports = store
