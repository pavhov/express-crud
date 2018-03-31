type isObject = (item?: Object) => boolean;

type isError = (item?: Error) => boolean;

type isString = (item?: String) => boolean;

type isArray = (item?: Array<any>) => boolean;

type isBoolean = (item?: boolean) => boolean;

type publisher = () => void;

type subscriber = () => void;


declare module NodeJS {

    interface Global {
        isObject: isObject,
        isError: isError,
        isString: isString,
        isArray: isArray,
        isBoolean: isBoolean,
    }
}

interface Colors {
    Reset: String;
    Bright: String;
    Dim: String;
    Underscore: String;
    Blink: String;
    Reverse: String;
    Hidden: String;
    FgBlack: String;
    FgRed: String;
    FgGreen: String;
    FgYellow: String;
    FgBlue: String;
    FgMagenta: String;
    FgCyan: String;
    FgWhite: String;
    BgBlack: String;
    BgRed: String;
    BgGreen: String;
    BgYellow: String;
    BgBlue: String;
    BgMagenta: String;
    BgCyan: String;
    BgWhite: String;
}


interface Console {
    colors: Colors;
}
