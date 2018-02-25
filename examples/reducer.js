module.exports = ({ output }) => {
  const queue = []
  return {
    action: (event) => {
      if (output.state === undefined) {
        queue.push(event)
      } else {
        output.next(output.state)
      }
    },
    state: (event) => {
      if (output.state === undefined) {
        while (queue.length > 0) {
          queue.shift()
          output.next(event)
        }
      }
      output.state = event
    },
  }
}
