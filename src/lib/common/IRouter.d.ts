import {Router as EXRouter} from "express";


export interface Router {
    router: EXRouter;

    list: string;
    paginate: string;
    show: string;
    create: string;
    update: string;
    remove: string;
    restore: string;
    destroy: string;

}