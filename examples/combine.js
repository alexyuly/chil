module.exports = ({
  output,
  variables,
}) => {
  const methods = {}
  output.ready = false
  output.state = {}
  for (const key in variables) {
    methods[key] = (event) => {
      output.state[key] = event
      if (!output.ready) {
        for (const k in variables) {
          if (output.state[k] === undefined) {
            return
          }
        }
        output.ready = true
      }
      output.next(output.state)
    }
  }
  return methods
}
