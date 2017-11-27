/**
 * @param {*} node any value
 * @returns {boolean} true if and only if node is a non-null object
 */
const isGraph = (node) => typeof node === 'object' && node !== null

module.exports = {
    isGraph,
}
