#!/usr/bin/env node
const path = require('path')
const process = require('process')
const inquirer = require('inquirer')
const {createLieFiServer, connectionTypes} = require('./index')

// starts the server
function createServer(filePath, port){
    // host the server
    console.log('Serving app from: ', filePath)
    return createLieFiServer(port, require(filePath))
}

// parse the args
const argv = require('minimist')(process.argv.slice(2))

// get the index file path
const filePath = path.resolve(process.cwd(), argv._[0])
const port = argv.p || 3000
const type = argv.c || ''

// create the server
const server = createServer(filePath, port)

function promptChoice() {
    // ask what type of connection to use
    inquirer.prompt([
        {
            type: 'list',
            name: 'type',
            message: 'What connection type you want to test now?',
            choices: Object.keys(connectionTypes).concat(['quit']),
            filter: val => val.toLowerCase()
        }
    ])
    .then(handleChoice)
}

// handle the choice result
function handleChoice({type}) {
    // handles exit
    if(type == 'quit'){
        process.exit(0)
        return
    }

    // set the prompt connection type
    server.setConnectionType(type)

    // ask again
    promptChoice()
}

if(type !== ''){
    server.setConnectionType(type)
}else{
    promptChoice()
}