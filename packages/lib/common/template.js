const reduce = require('../factories/reduce')

const template = (state, action) => {
  const result = []
  const nodes = state instanceof Array
    ? state
    : [ state ]
  for (const node of nodes) {
    if (node.prop) {
      for (const key in action) {
        if (node.prop === key) {
          result.push(action[key])
          break
        }
      }
    } else if (node.type) {
      const newNode = {
        type: node.type,
        attributes: Object.assign({}, node.attributes),
      }
      for (const name in newNode.attributes) {
        const attribute = newNode.attributes[name]
        if (attribute.prop) {
          for (const key in action) {
            if (attribute.prop === key) {
              newNode.attributes[name] = action[key]
              break
            }
          }
        }
      }
      if (node.children) {
        newNode.children = template(node.children, action)
      }
      result.push(newNode)
    } else {
      result.push(node)
    }
  }
  return state instanceof Array
    ? result
    : result[0]
}

module.exports = reduce((state, action, next) => next(template(state, action)))
