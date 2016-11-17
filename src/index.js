const os = require('os')
const net = require('net')
const fs = require('fs')
const Throttle = require('throttle')

// various connections properties
export const connectionTypes = {
    perfect: {bps: 100000000, delay: 0},
    slow: {bps: 4000, delay: 3000},
    'lie-fi': {bps: 1, delay: 10000},
    offline: {bps: 0, delay: 0}
}

export function createLieFiServer(port, appServer){
    // create the sock file
    const appServerPath = os.platform() == 'win32' ?
        '\\\\.\\pipe\\offlinefirst' + Date.now() + '.sock' :
        'offlinefirst.sock'

    // the connections list
    let connections = []
    let serverUp = false
    let appServerUp = false
    let connectionType = null

    // create the exposed server
    const exposedServer = net.createServer()
    exposedServer.on('connection', socket => {
        // avoid strange cases
        let closed = false

        // remove the socket from the connection on close
        socket.on('close', _ => {
            if(!closed) return
            closed = true

            connections.splice(connections.indexOf(socket), 1)
        })

        // on error just print to console
        socket.on('error', err => {
            console.log(err)
        })

        // handle the connection
        const connection = connectionTypes[connectionType] || connectionTypes.perfect
        const makeConnection = _ => {
            if (closed) return
            // connect to the local socket and pipe the resul
            const appSocket = net.connect(appServerPath)
            appSocket.on('error', err => console.log(err))
            socket.pipe(new Throttle(connection.bps)).pipe(appSocket)
            appSocket.pipe(new Throttle(connection.bps)).pipe(socket)
        }

        // emulate the connection delay
        if (connection.delay) {
            setTimeout(makeConnection, connection.delay)
            return
        }

        makeConnection()
    })

    // internal replacement for listen
    const listen = _ => {
        // make listen the wrapper server
        serverUp = true
        exposedServer.listen(port, _ => {
            console.log("Server listening at localhost:" + port);
        })

        // ensure the real server is up
        if (!appServerUp) {
            if (fs.existsSync(appServerPath)) fs.unlinkSync(appServerPath)
            
            appServer.listen(appServerPath);
            appServerUp = true;
        }
    }

    const setConnectionType = type => {
        // set the new connection type
        if(type === connectionType) return
        connectionType = type

        // destroy live connections
        connections.forEach(connection => connection.destroy())

        // offline mode means destroy the wrapper server
        if (type === 'offline') {
            if (!serverUp) return;
            exposedServer.close();
            serverUp = false;
            return;
        }

        // otherwise, make the server up
        if (!serverUp) {
            listen();
        }
    }

    return {setConnectionType}
}