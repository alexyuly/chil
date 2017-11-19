const reducerClass = require('../runtime/reducerClass')
const { definePath } = require('../runtime/require')
const definition = definePath('./multiply')

const multiply = reducerClass(definition, (state, action) => state * action)

module.exports = multiply
