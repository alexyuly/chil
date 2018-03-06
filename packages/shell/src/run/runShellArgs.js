const runShellArgs = ({
  component,
  args,
}) => {
  let argInput
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    if (arg.substring(0, 2) === '--') {
      argInput = component.inputs[arg.substring(2)]
    } else if (argInput) {
      argInput.next(arg)
    }
  }
}

module.exports = runShellArgs
