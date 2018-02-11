#!/usr/bin/env node

const applyComponent = require('./applyComponent')
const createComponent = require('./createComponent')

const pathToSource = process.argv[2]
const component = createComponent(pathToSource)

const args = process.argv.slice(3)
applyComponent(component, args)
