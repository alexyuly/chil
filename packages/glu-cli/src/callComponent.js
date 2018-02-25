const argIsInputName = (arg) => arg.substring(0, 2) === '--'
const callComponent = ({
  component,
  args,
}) => {
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    if (argIsInputName(arg)) {
      const inputName = arg.substring(2)
      const input = component.inputs[inputName]
      const nextArg = args[i + 1]
      if (nextArg === undefined || argIsInputName(nextArg)) {
        input.next()
      } else {
        input.next(nextArg)
      }
    }
  }
}

module.exports = callComponent
