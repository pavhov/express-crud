/// <reference path="_all.d.ts" />

import * as express from "express";
import * as debug from "debug";

import Config from "./lib/config";

import "./lib/Mongoose";

/**
 * The server.
 *
 * @class Server
 */
class App {
    public app: express.Application;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(): App {
        return new App();
    }

    /**
     * Constructor.
     *
     * @class App
     * @constructor
     */
    constructor() {
        //create expressjs application
        this.app = express();

        //configure application
        this.config();
    }

    /**
     * @name config
     *
     * @returns {Config}
     */
    private config(): Config {
        return new Config(this.app);
    }

}


export const app = App.bootstrap().app;
