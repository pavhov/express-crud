import {Request, Response, NextFunction} from "express";
import {object, string, number, validate, ObjectSchema} from "joi";

export class Books {
    /**
     * @name create
     *
     * @param {e.Request} req
     * @param {e.Response} res
     * @param {e.NextFunction} next
     */
    create(req: Request, res: Response, next: NextFunction): void {
        const schema: ObjectSchema = object({
            name: string().required(),
            pages: number().required(),
            author: string().required()
        });

        const {error, value}: any = validate(req.body, schema);

        if (error) {
            error.status = 406;
            next(error);

            return void(0);
        }

        req.body = value;
        next();

    }

    /**
     * @name update
     *
     * @param {e.Request} req
     * @param {e.Response} res
     * @param {e.NextFunction} next
     */
    update(req: Request, res: Response, next: NextFunction): void {
        const schema: ObjectSchema = object({
            name: string(),
            pages: number(),
            author: string()
        });

        const {error, value}: any = validate(req.body, schema);

        if (error) {
            error.status = 406;
            next(error);

            return void(0);
        }

        req.body = value;
        next();

    }

}
