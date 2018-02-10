module.exports = (cliArgs) => {
  const applicationArgs = []
  for (let i = 0; i < cliArgs.length; i += 1) {
    if (cliArgs[i].substring(0, 2) === '--') {
      const applicationArg = {
        method: cliArgs[i].substring(2),
      }
      const nextCliArg = cliArgs[i + 1]
      if (nextCliArg && nextCliArg.substring(0, 2) !== '--') {
        applicationArg.event = nextCliArg
      }
      applicationArgs.push(applicationArg)
    }
  }
  return applicationArgs
}
