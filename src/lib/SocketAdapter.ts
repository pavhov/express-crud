import {EventEmitter} from "events";
import * as debugI from "debug";
import {server as Server, client as Client, router as Router} from "websocket";

import {publisher, subscriber} from "./redis";

const debug: any = debugI(process.env.NODE_NAME);

subscriber.subscribe("addSocketRouter");
subscriber.subscribe("removeSocketRouter");

subscriber.on("subscribe", (channel: string, count: number): void => {
    debug("Redis:subscribe", channel, count);
});

let routes: object = {}, server, router, events: object = {}, mainConfig;


/**
 * @name serverHandler
 * @description Create ws|wss servers and them routers
 * @example '
 const WebSocket = require('path/to/lib/SocketAdapter');
 WebSocket({httpServer: httpsServer, autoAcceptconnections: false, keepalive: true}).Server();
 '
 *
 * @param config
 * @returns {*}
 */
const serverHandler = (config): void => {
    server = new Server(config || mainConfig);
    debug("\u001b[36m Socket: created server");

    // server.on("close", () => {
    //     debugger; //TODO: will be continue
    // });

    routerHandler(server);
};

/**
 * @name clientHandler
 * @description create client of ws|wss //TODO: not completed !!!
 *
 * @param config
 * @constructor
 */
const clientHandler = (config): void => {
    const client = new Client(config);
};

/**
 * @name routerHandler
 * @description Create servers routers with individual protocols //TODO: 'individual protocols' part not completed
 * @example '
 const {Router} = require('path/to/lib/SocketAdapter')();
 Router(server);
 '
 *
 * @param server
 * @constructor
 */
const routerHandler = (server): void => {
    router = new Router({server});

    subscriber.on("message", (key: string, path: string): void => {
        if (key === "addSocketRouter") {
            routerBuilder(path, router);
        }

        if (key === "removeSocketRouter") {
            disuseRoutes(path);
        }

    });


    routerBuilder(null, router);
};

/**
 * @name connectionHandler
 * @description working on client connection
 *
 * @param connection
 * @param subscriber
 * @returns {{on, send}}
 */
const connectionHandler = (connection, subscriber): object => {
    const send = connection.send.bind(connection);

    return {
        on: connection.socket.on.bind(connection.socket),
        send: (data) => {
            if (!data.event && !data.data) {
                return debug("Socket: Data for send will be contain only 'event' and 'data' items");
            }

            data = JSON.stringify(data);

            send(data);

        },
        channel: {
            on: (event, cb) => {
                subscriber.on("message", (key, data) => key === event && cb(JSON.parse(data || {})));

            },
            emit: (channel, data) => {
                subscriber.publish(channel, data);

            }

        }

    };

};

/**
 * @name publishHandler
 *
 * @param {string} sourceKey
 * @param {string} socket
 */
const publishHandler = (sourceKey: string, socket: any): void => {
    subscriber.on("message", (key: string, val: string): void => {
        let parsedData: any = {};

        try {
            parsedData = JSON.parse(val);
        } catch (e) {
            throw new Error("Socket: Data for send will be contain only 'event' and 'data' items");
        }

        if (sourceKey.replace("/", "") === key) {
            socket.send({
                event: parsedData.event,
                data: parsedData.data
            });
        }

        debug("Redis:message", key, val);
    });

};

/**
 * @name useRoutes
 * @description Add route path with callback function to socket
 * @example '
 const socket = require('path/to/lib/SocketAdapter');
 socket().use('/route/path', callbackFunction);
 '
 *
 * @param path
 * @param callback
 */
const useRoutes = (path, callback): void => {
    if (typeof path !== "string") {
        throw new Error("The function first parameter will be only string (path of orl)");
    }

    if (callback && !(callback instanceof Function)) {
        throw new Error("The function second parameter will be only function");
    }

    if (!routes[path]) {
        if (!callback) {
            callback = publishHandler.bind(null, path);
        }

        routes[path] = callback;

        routerBuilder(path, router);
        debug("\u001b[36m Socket: seting up socket route", path);

    }
};

/**
 * @name disuseRoutes
 * @description Remove route path with callback function to socket
 * @example '
 const socket = require('path/to/lib/SocketAdapter');
 socket().disuse('/route/path');
 '
 *
 * @param path
 */
const disuseRoutes = (path): void => {
    if (typeof path !== "string") {
        throw new Error("The function first parameter will be only string (path of orl)");

    }

    if (routes[path]) {
        router.unmount(path, "echo-protocol");
        subscriber.unsubscribe(path);
        // server.unmount(path, 'echo-protocol');
        delete routes[path];

        debug("\u001b[36m Socket: seting down socket route", path);

    }
};

/**
 * @name routerBuilder
 * @description add routes to socketconnection
 *
 * @param singlePath
 * @param router
 */
const routerBuilder = (singlePath, router): void => {
    if (!singlePath) {
        for (let path in routes) {
            let route = routes[path];

            routerMount(path, router, route);

        }

    } else {
        routerMount(singlePath, router, routes[singlePath]);

    }

};

/**
 * @name routerMount
 *
 * @param path
 * @param router
 * @param route
 */
const routerMount = (path, router, route): void => {
    if (router.findHandlerIndex(router.pathToRegExp(path).toString(), "echo-protocol") === -1) {

        subscriber.subscribe(path.replace("/", ""));
        router.mount(path, "echo-protocol", (request) => {
            debug("\u001b[36m Socket: accepted socket connection", request.origin, (request.url || request.resource));
            return (route && (route.callback || route))(connectionHandler(request.accept(), subscriber));

        });
        debug("\u001b[36m Socket: mount socket route", path);

    } else {
        debug("\u001b[36m Socket: mounted socket route", path);

    }

};

/**
 * @name isAllowedOrigin
 *
 * @param origin
 * @returns {boolean}
 */
const isAllowedOrigin = (origin): boolean => {
    const validOrigins = ["https://127.0.0.1:8443"];
    return validOrigins.indexOf(origin) !== -1;
};

/**
 * @name init
 *
 * @param config
 */
const init = (config): void => {
    if (config) {
        mainConfig = config;
        debug("\u001b[36m Socket: seting up socket config");
    }

    serverHandler(config);

};


const use: any = useRoutes;
const disuse: any = disuseRoutes;


export {
    init,
    use,
    disuse,
};
