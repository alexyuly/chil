const runComponentEvents = ({ component }) => {
  for (const event of component.events) {
    const eventComponent = event.component === 'self'
      ? component
      : component.children[event.component]
    const eventStream = event.method === 'output'
      ? eventComponent.output
      : eventComponent.inputs[event.method]
    eventStream.next(event.value)
  }
}

module.exports = runComponentEvents
