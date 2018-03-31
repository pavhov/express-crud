import {Router} from "express";
import {Router as CRouter} from "../../lib/common/Router";

import {Books as BooksController} from "../controllers";
import {Books as BooksMiddleware} from "../middlewares";

class Books extends CRouter {
    /**
     * @name self
     * @access public
     *
     * @type {IbooksD}
     */
    public static self: Books = new Books();

    /**
     * @name router
     * @access public
     *
     * @type {Router}
     */
    public routerGroup: Router = Router();

    constructor() {
        super();
    }

    /**
     * @name instances
     *
     * @returns {e.Router}
     */
    instances(): Router {
        const controller: BooksController = new BooksController;
        const middleware: BooksMiddleware = new BooksMiddleware;

        this.router.get(this.list, controller.list);
        this.router.get(this.paginate, controller.paginate);
        this.router.get(this.show, controller.show);
        this.router.put(this.update, middleware.update, controller.update);
        this.router.post(this.create, middleware.create, controller.create);
        this.router.delete(this.destroy, controller.remove);

        this.routerGroup.use("/api/books", this.router);

        return this.routerGroup;
    }

}


export default Books.self.instances();
