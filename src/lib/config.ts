import * as path from "path";
import * as favicon from "serve-favicon";
import * as debugI from "debug";
import * as session from "express-session";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as redisStoreM from "connect-redis";
import {static as EXstatic, Errback, Request, RequestHandler, Handler, Response, NextFunction, Application} from "express";

const debug: any = debugI(process.env.NODE_NAME);

const redisStore = redisStoreM(session);

import * as routers from "../modules/routers";
import * as socket from "../lib/SocketAdapter";

/**
 * @accept Public
 */
export default class Config {
    /**
     * @name constructor
     *
     * @param app
     */
    constructor(app: any) {

        app.use(this.useSession());
        app.use(this.useFavicon());

        this.useBodyParser(app);

        app.set("trust proxy", 1);

        this.setView(app);

        app.use(this.useCookieParser());
        app.use(this.useStaticPats());
        app.use(this.useRoutes());
        app.use(this.useNotFound);
        app.use(this.useError);

    }

    /**
     * @name setView
     *
     * @param app
     */
    public setView(app: Application): void {
        app.set("views", path.join("..", "views"));
        app.set("view engine", "ejs");
    }

    /**
     * @name useSession
     *
     * @returns {(e.RequestHandler | (req, res, next) => any)[]}
     */
    public useSession(): Array<any> {
        return [
            session({
                name: "session",
                secret: process.env.SESSION_KEY,
                resave: true,
                saveUninitialized: true,
                store: new redisStore({
                    url: process.env.REDIS,
                    db: parseInt(process.env.SESSION_STORE)
                }),
                cookie: {
                    // name: "session",
                    // keys: [process.env.SESSION_KEY],
                    secure: false,
                    httpOnly: true,
                    maxAge: parseInt(process.env.COOKIE_MAX_AGE)
                }
            }),
            (req: any, res: Response, next: NextFunction): void => {
                if (!req.session) {
                    return next(new Error("oh no")); // handle error
                }

                socket.use("/" + req.sessionID);
                next();
            }
        ];
    }

    /**
     * @name useFavicon
     *
     * @returns {e.RequestHandler}
     */
    public useFavicon(): RequestHandler {
        return favicon(path.join(process.cwd(), "public", "favicon.ico"));
    }

    /**
     * @name useBodyParser
     *
     * @param app
     */
    public useBodyParser(app: Application): void {
        app.use(bodyParser.raw());
        app.use(bodyParser.text());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));
    }

    /**
     * @name useCookieParser
     *
     * @returns {e.RequestHandler}
     */
    public useCookieParser(): RequestHandler {
        return cookieParser();
    }

    /**
     * @name useStaticPats
     *
     * @returns {Handler}
     */
    public useStaticPats(): Handler {
        return EXstatic(path.join(__dirname, "public"));
    }

    /**
     * @name useRoutes
     *
     * @returns {Array}
     */
    public useRoutes(): Array<any> {
        return routers.apps;
    }

    /**
     * @name useNotFound
     *
     * @param {Request} req
     * @param {Response} res
     * @param {e.NextFunction} next
     */
    public useNotFound(req: Request, res: Response, next: NextFunction): void {
        next({
            status: 404,
            message: "Not Found",
        });
    }

    /**
     * @name useError
     *
     * @param {Error | any} err
     * @param {Request} req
     * @param {Response} res
     * @param {e.NextFunction} next
     */
    public useError(err: Error | any, req: Request, res: Response, next: NextFunction): void {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};

        // render the error page
        res.status(err.status || 500);
        /*if (
            /application\/json/g.test(req.header("content-type")) ||
            /application\/json/g.test(req.header("accept"))
        ) {*/
        let result: any = {
            error: err.message
        };

        if (req.app.get("env") === "development") {
            result = {
                url: req.url,
                body: req.body,
                error: err,
                time: new Date()
            };
        }

        res.send(result);
        debug(err, console.colors.Reset);
        /*} else {
            res.render("error");
            debug(JSON.stringify(res.locals.error, null, 1),
                console.colors.Reset);
        }*/

    }

}
