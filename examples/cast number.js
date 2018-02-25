module.exports = ({ output }) => ({
  action: (event) => {
    output.next(Number(event))
  },
})
