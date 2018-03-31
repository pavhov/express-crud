/**
 * @name isObject
 * @description global function for check item to object
 *
 * @param {Object} item
 * @returns {boolean}
 */
function isObject(item?: Object): boolean {
    return typeof item === "object";
}

/**
 * @name isError
 * @description global function for check item to Error
 *
 * @param {Error} item
 * @returns {boolean}
 */
function isError(item?: Error): boolean {
    return item instanceof Error;
}

/**
 * @name isString
 * @description global function for check item to string
 *
 * @param {String} item
 * @returns {boolean}
 */
function isString(item?: String): boolean {
    return typeof item === "string";
}

/**
 * @name isArray
 * @description global function for check item to Array
 *
 * @param {Array<any>} item
 * @returns {boolean}
 */
function isArray(item?: Array<any>): boolean {
    return item instanceof Array;
}

/**
 * @name isBoolean
 * @description global function for check item to boolean
 *
 * @param {boolean} item
 * @returns {boolean}
 */
function isBoolean(item?: boolean): boolean {
    return typeof item === "boolean";
}

/**
 *
 * @type {{
     * Reset: string;
     * Bright: string;
     * Dim: string;
     * Underscore: string;
     * Blink: string;
     * Reverse: string;
     * Hidden: string;
     * FgBlack: string;
     * FgRed: string;
     * FgGreen: string;
     * FgYellow: string;
     * FgBlue: string;
     * FgMagenta: string;
     * FgCyan: string;
     * FgWhite: string;
     * BgBlack: string;
     * BgRed: string;
     * BgGreen: string;
     * BgYellow: string;
     * BgBlue: string;
     * BgMagenta: string;
     * BgCyan: string;
     * BgWhite: string
 * }}
 */
const colors: any = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m"
};



/**
 *
 * @name isObject
 * @description global function
 *
 * @type {(item?: Object) => boolean}
 *
 * @global isObject
 *
 * @param item
 *
 * @returns {boolean}
 */
global.isObject = isObject;

/**
 *
 * @name isError
 * @description global function
 *
 * @type {(item?: Error) => boolean}

 * @global isError

 * @param item

 * @returns {boolean}
 */
global.isError = isError;

/**
 *
 * @name isString
 * @description global function
 *
 * @type {(item?: String) => boolean}
 *
 * @global isString
 *
 * @param item
 *
 * @returns {boolean}
 */
global.isString = isString;

/**
 *
 * @name isArray
 * @description global function
 *
 * @type {(item?: Array<any>) => boolean}
 *
 * @global isArray
 *
 * @param item
 *
 * @returns {boolean}
 */
global.isArray = isArray;

/**
 *
 * @name isBoolean
 * @description global function
 *
 * @type {(item?: boolean) => boolean}
 *
 * @global isBoolean
 *
 * @param item
 *
 * @returns {boolean}
 */
global.isBoolean = isBoolean;

/**
 * @name colors
 * @description global colors for console
 *
 * @type Object<String>
 */
global.console.colors = colors;
