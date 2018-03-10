const reduce = require('../factories/reduce')

const template = (nodes, props) => {
  const result = []
  for (const node of nodes) {
    if (node.prop) {
      for (const key in props) {
        if (node.prop === key) {
          result.push(props[key])
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
          for (const key in props) {
            if (attribute.prop === key) {
              newNode.attributes[name] = props[key]
              break
            }
          }
        }
      }
      newNode.children = template(node.children, props)
      result.push(newNode)
    } else {
      result.push(node)
    }
  }
  return result
}

module.exports = reduce((state, action, next) => next(template(state, action)))
