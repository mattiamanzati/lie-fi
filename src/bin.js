#!/usr/bin/env node
const path = require('path')
const process = require('process')
const {createLieFiServer, connectionTypes} = require('./index')

// parse the args
const argv = require('minimist')(process.argv.slice(2))

// get the index file path
const filePath = path.resolve(process.cwd(), argv._[0])
const port = argv.p || 3000
const type = argv.c || 'slow'

// check the connection type exists
if(Object.keys(connectionTypes).indexOf(type) === -1){
    console.log('Connection type must be one of ', Object.keys(connectionTypes).join(', '))
    process.exit(1)
}

// host the server
console.log('Serving app from: ', filePath)
const server = createLieFiServer(port, require(filePath))
server.setConnectionType(argv.c)