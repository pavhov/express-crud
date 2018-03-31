import * as debugI from "debug";
import {
    Schema,
    model,
    PaginateModel,
    PaginateOptions,
    PaginateResult,
    Document,
    plugin,
    set,
    connect,
} from "mongoose";
import * as mongoose from "mongoose";
import mongoosePaginate = require("mongoose-paginate");

const debug: any = debugI(process.env.NODE_NAME);

const options = {
    promiseLibrary: global.Promise,
    lean: true
};

plugin(mongoosePaginate);

set("debug", (...args) => {
    const usede = process.memoryUsage().heapUsed / 1024 / 1024;

    debug(console.colors.FgCyan, `Memory: ${Math.round(usede * 100) / 100} MB Mongoose:`, ...args, console.colors.Reset);
});

let dateConnect = (new Date).getTime();

connect(process.env.MONGODB, options)
    .then((data) => {
        let dateConnectEnd = (new Date).getTime();

        const usede = process.memoryUsage().heapUsed / 1024 / 1024;

        debug(`Mongoose:${console.colors.FgGreen} `,
            `Memory: ${Math.round(usede * 100) / 100} MB`,
            "Connected:", (dateConnectEnd - dateConnect) + "ms",
            console.colors.Reset);
        debug("Mongoose:connect()", process.env.MONGODB);

    })
    .catch((err) => {
        debug("Mongoose:err()", process.env.MONGODB, err.message);

    });


/**
 *
 */
export {
    model,
    Schema,
};
