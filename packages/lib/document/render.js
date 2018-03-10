const render = (element, next = [], prev = []) => {
  const prevChildren = []
  for (let i = 0; i < element.childNodes.length; i++) {
    const prevChild = element.childNodes[i]
    if (i < next.length) {
      prevChildren.push(prevChild)
    } else {
      element.removeChild(prevChild)
    }
  }
  for (let i = 0; i < next.length; i++) {
    const nextNode = next[i]
    const prevNode = prev[i]
    const prevChild = prevChildren[i]
    if (nextNode.type) {
      if (prevNode && prevNode.type === nextNode.type) {
        for (const name in prevNode.attributes) {
          if (!(name in nextNode.attributes)) {
            prevChild.removeAttribute(name)
          }
        }
        for (const name in nextNode.attributes) {
          const nextAttribute = nextNode.attributes[name]
          if (nextAttribute !== prevNode.attributes[name]) {
            prevChild.setAttribute(name, nextAttribute)
          }
        }
        render(prevChild, nextNode.children, prevNode.children)
      } else {
        if (prevChild) {
          element.removeChild(prevChild)
        }
        const nextChild = element.appendChild(document.createElement(nextNode.type))
        for (const name in nextNode.attributes) {
          nextChild.setAttribute(name, nextNode.attributes[name])
        }
        render(nextChild, nextNode.children)
      }
    } else if (prevNode !== nextNode) {
      if (prevChild) {
        element.removeChild(prevChild)
      }
      element.appendChild(document.createTextNode(nextNode))
    }
  }
}

module.exports = (component) => ({
  methods: {
    action: (action) => {
      render(document.body, action, component.store.action)
      component.write({ action })
    },
  },
})
