module.exports = () => {
  const listeners = []
  return {
    connect: (listener) => {
      listeners.push(listener)
    },
    output: (event) => {
      for (const listener of listeners) {
        listener(event)
      }
    },
  }
}
