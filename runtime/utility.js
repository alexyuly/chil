const exception = require('./exception')

/**
 * @param {*} node any value
 * @returns {boolean} true if and only if node is a non-Array, non-null object
 */
const isGraph = (node) => typeof node === 'object' && !(node instanceof Array) && node !== null

/**
 * Deeply merges properties of base into target, and throws an exception if any properties conflict.
 * @param {object} output - an object to which properties are written
 * @param {object} input - an object from which properties are read
 */
const extend = (output, input) => {
    for (const key in input) {
        const targetNode = output[key]
        const baseNode = input[key]
        if (isGraph(targetNode) && isGraph(baseNode)) {
            extend(targetNode, baseNode)
        } else if (targetNode === undefined) {
            output[key] = baseNode
        } else {
            throw exception.baseExtensionConflict(output, input)
        }
    }
}

module.exports = {
    extend,
    isGraph,
}
