import {Request, Response, NextFunction} from "express";
import {booksModel} from "../models/books";
import {publisher} from "../../lib/redis";
import {throws} from "assert";


export class Books {
    /**
     * @name list
     *
     * @param {e.Request} req
     * @param {e.Response} res
     * @param {e.NextFunction} next
     * @returns {any}
     */
    public list(req: Request, res: Response, next: NextFunction): void {
        booksModel
            .find({})
            .then((data: any): void => {
                res.send({
                    data: data,
                    meta: {
                        length: data.length
                    }
                });
            })
            .catch((err: Error): void => {
                next({
                    message: "Error when getting Books.",
                    error: err,
                    status: 406
                });
            });

    }

    /**
     * @name paginate
     *
     * @param {e.Request} req
     * @param {e.Response} res
     * @param {e.NextFunction} next
     * @returns {any}
     */
    public paginate(req: Request, res: Response, next: NextFunction): void {
        booksModel
            .find({})
            .skip((req.params.offset > 0 ? req.params.offset - 1 : req.params.offset) * req.params.limit)
            .limit(req.params.limit)
            .then((data: any): void => {
                res.send({
                    data: data,
                    meta: {
                        length: data.length
                    }
                });

            })
            .catch((err: Error): void => {
                next({
                    message: "Error when getting Books.",
                    error: err,
                    status: 406
                });

            });

    }

    /**
     *
     * @param {e.Request} req
     * @param {e.Response} res
     * @param {e.NextFunction} next
     * @returns {any}
     */
    public show(req: Request, res: Response, next: NextFunction): void {
        const _id = req.params.id;

        booksModel
            .findOne({
                _id
            })
            .then((data: any): void => {
                res.json(data);
            })
            .catch((err: Error): void => {
                next({
                    message: "Error when getting Book.",
                    error: err,
                    status: 406
                });
            });

    }

    /**
     * @name create
     *
     * @param {e.Request} req
     * @param {e.Response} res
     * @param {e.NextFunction} next
     * @returns {any}
     */
    public create(req: Request | any, res: Response, next: NextFunction): void {
        booksModel
            .create({
                name: req.body.name,
                pages: req.body.pages,
                author: req.body.author,
            })
            .then((data: any): void => {
                res.status(201).json(data);
                publisher.publish(req.sessionID, JSON.stringify({
                    event: "created",
                    data
                }));
            })
            .catch((err: Error): void => {
                publisher.publish(req.sessionID, JSON.stringify({
                    event: "create-error",
                    data: {
                        message: "Error when creating Book",
                    }
                }));
                next({
                    message: "Error when creating Book",
                    error: err,
                    status: 406
                });
            });

    }

    /**
     * @name update
     *
     * @param {e.Request} req
     * @param {e.Response} res
     * @param {e.NextFunction} next
     * @returns {any}
     */
    public update(req: Request | any, res: Response, next: NextFunction): void {
        const _id = req.params.id;

        booksModel
            .update({_id}, {
                $set: {
                    name: req.body.name,
                    pages: req.body.pages,
                    author: req.body.author,
                }
            })
            .then((data: any): void => {
                publisher.publish(req.sessionID, JSON.stringify({
                    event: "updated",
                    data
                }));
                res.status(201).json({
                    status: !!(data.ok && data.nModified),
                    ok: data.ok,
                    nModified: data.nModified,
                });
            })
            .catch((err): void => {
                publisher.publish(req.sessionID, JSON.stringify({
                    event: "update-error",
                    data: {
                        message: "Error when updating Book",
                    }
                }));
                next({
                    message: "Error when updating Book",
                    error: err,
                    status: 406
                });
            });

    }

    /**
     * @name remove
     *
     * @param {e.Request} req
     * @param {e.Response} res
     * @param {e.NextFunction} next
     * @returns {any}
     */
    public remove(req: Request | any, res: Response, next: NextFunction): void {
        const _id = req.params.id;

        booksModel.remove({_id})
            .then((data: any): void => {
                publisher.publish(req.sessionID, JSON.stringify({
                    event: "removed",
                    data
                }));
                res.status(201).json({
                    status: !!(data.ok && data.n),
                    ok: data.ok,
                    n: data.n,
                });
            })
            .catch((err: Error): void => {
                publisher.publish(req.sessionID, JSON.stringify({
                    event: "remove-error",
                    data: {
                        message: "Error when updating Book",
                    }
                }));
                next({
                    message: "Error when updating Book",
                    error: err,
                    status: 406
                });
            });

    }

}
