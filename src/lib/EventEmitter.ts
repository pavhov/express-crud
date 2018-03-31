import {EventEmitter} from "events";


/**
 * @access {public}
 */
class CustomEventEmitter extends EventEmitter {
    /**
     *
     */
    constructor() {
        super();
    }

    /**
     * @name on
     *
     * @param args
     * @returns {*}
     */
    on(...args: Array<any>): any {
        return super.on.apply(this, args);
    }

    /**
     * @name emit
     *
     * @param args
     * @returns {boolean}
     */
    emit(...args: Array<any>): boolean {
        return super.emit.apply(this, args);
    }

}


/**
 *
 * @type {CustomEventEmitter}
 */
export default new CustomEventEmitter;
