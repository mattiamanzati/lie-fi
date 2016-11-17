var express = require('express')

// make a sample static server
var app = express()
app.use('/', express.static(__dirname + '/public'))

// instead of listen, export the app/httpServer
module.exports = app