var express = require('express')

// make a sample static server
var app = express()

// use maxAge to avoid caching
app.use('/', express.static(__dirname + '/public', { maxAge: 0 }))

// instead of listen, export the app/httpServer
module.exports = app