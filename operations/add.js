const reducerClass = require('../runtime/reducerClass')
const { definePath } = require('../runtime/require')
const definition = definePath('./add')

const add = reducerClass(definition, (state, action) => state + action)

module.exports = add
