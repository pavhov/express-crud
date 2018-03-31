#!/usr/bin/env node

require('dotenv').config({path: './.env'});
require('../src/helpers/global');

const debug = require('debug')(process.env.NODE_NAME);
const {app} = require('../src/app');

/**
 * Module dependencies.
 */
const fs = require('fs');
const WebSocket = require('../src/lib/SocketAdapter');

const http = require('http');
const spdy = require('spdy');

let httpPort, httpsPort, httpServer, httpsServer, dateConnect;


//cluster.masterProcess(process.env.CLUSTER_INSTANCE_COUNT);
//cluster.workerProcess(worker);


/**
 * @name worker
 * @description cluster worker process
 */
const worker = () => {

    /**
     * Get port from environment and store in Express.
     */
    httpPort = normalizePort(process.env.HTTP_PORT);
    app.set('port', httpPort);

    /**
     * Create HTTP server.
     */
    httpServer = http.createServer((req, res) => {
        res.writeHead(301, {"Location": "https://" + req.headers['host'].replace(httpPort, httpsPort) + req.url});
        res.end();
    });

    /**
     * Get port from environment and store in Express.
     */
    httpsPort = normalizePort(process.env.SPDY_PORT);
    app.set('port', httpsPort);

    /**
     * Create HTTP server.
     */
    httpsServer = spdy.createServer({
        key: fs.readFileSync('./certs/nodejs.key'),
        cert: fs.readFileSync('./certs/nodejs.crt'),
        ca: fs.readFileSync('./certs/nodejs.csr'),
    }, app);

    dateConnect = (new Date).getTime();

    /**
     * Listen on provided port, on all network interfaces.
     */
    httpServer.listen(httpPort, process.env.HTTP_IP);
    httpServer.on('error', onError.bind(null, httpPort, httpServer));
    httpServer.on('listening', onListening.bind(null, httpServer));

    /**
     * Listen on provided port, on all network interfaces.
     */
    httpsServer.listen(httpsPort, process.env.SPDY_IP);
    httpsServer.on('error', onError.bind(null, httpsPort, httpsServer));
    httpsServer.on('listening', onListening.bind(null, httpsServer));

    WebSocket.init({httpServer: httpsServer, autoAcceptConnections: false, keepalive: true});

};

/**
 * @name normalizePort
 * @description Normalize a port into a number, string, or false.
 *
 * @return mixed|int|boolean
 *
 */
const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // Named pipe
        return val;
    }

    if (port >= 0) {
        // Port number
        return port;
    }

    return false;
};

/**
 * @name onError
 * @description Event listener for HTTP server "error" event.
 */
const onError = (port, server, error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // Handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES': {
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        }
        case 'EADDRINUSE': {
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        }
        default: {
            throw error;
        }
    }
};

/**
 * @name onListening
 * @description cEvent listener for HTTP server "listening" event.
 */
const onListening = (server) => {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    let dateConnectEnd = (new Date).getTime();

    debug(`\u001b[36m Listening on ` + bind,
        `Memory: ${Math.round(used * 100) / 100}MB`,
        'Connected:', (dateConnectEnd - dateConnect) + 'ms',
        console.colors.Reset
    );
};

worker();

/*
process.on('SIGINT', () => {
    httpServer.close();
    httpsServer.close();
});
*/
