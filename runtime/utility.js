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
        const outputNode = output[key]
        const inputNode = input[key]
        if (isGraph(outputNode) && isGraph(inputNode)) {
            extend(outputNode, inputNode)
        } else if (outputNode === undefined) {
            output[key] = inputNode
        } else {
            throw exception.extensionConflict(output, input)
        }
    }
}

module.exports = {
    extend,
    isGraph,
}
