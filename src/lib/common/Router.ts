import * as debugI from "debug";

import {Router as EXRouter} from "express";
import {Router as IRouter} from "./IRouter";

const debug: any = debugI(process.env.NODE_NAME);

export class Router implements IRouter {

    /**
     * @name router
     * @access public
     *
     * @type {Router}
     */
    public router: EXRouter = EXRouter();

    /**
     * @name list
     * @access public
     *
     * @type {string}
     */
    public list: string = "/list";

    /**
     * @name paginate
     * @access public
     *
     * @type {string}
     */
    public paginate: string = "/paginate";

    /**
     * @name show
     * @access public
     *
     * @type {string}
     */
    public show: string = "/:id";

    /**
     * @name create
     * @access public
     *
     * @type {string}
     */
    public create: string = "/";

    /**
     * @name update
     * @access public
     *
     * @type {string}
     */
    public update: string = "/:id";

    /**
     * @name remove
     * @access public
     *
     * @type {string}
     */
    public remove: string = "/remove/:id";

    /**
     * @name restore
     * @access public
     *
     * @type {string}
     */
    public restore: string = "/restore/:id";

    /**
     * @name destroy
     * @access public
     *
     * @type {string}
     */
    public destroy: string = "/:id";

    constructor() {
        debug("Router: ", this.constructor.name);

    }

}
