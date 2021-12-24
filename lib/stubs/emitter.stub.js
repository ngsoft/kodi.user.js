

/**
 * @param {string|EventTarget|undefined} target
 * @param {Object} [binding]
 * @returns emitter
 */
function emitter(target, binding) {

    if (!(this instanceof emitter)) {
        return new emitter(target);
    }


}

emitter.prototype = {

    /**
    * Add an event listener
    * @param {string} type
    * @param {function} listener
    * @param {boolean|Object} [options]
    * @returns {emitter}
    */
    on: function (type, listener, options) {
        return this;
    },
    /**
    * Add an event listener to be triggered once
    * @param {string} type
    * @param {function} listener
    * @param {boolean|Object} [options]
    * @returns {emitter}
    */
    one: function (type, listener, options) {

        return this;
    },

    /**
    * Removes an event listener
    * @param {string} type
    * @param {function} [listener]
    * @param {boolean} [capture]
    * @returns {emitter}
    */
    off: function (type, listener, capture) {

        return this;
    },

    /**
    * Dispatches an event
    * @param {string|Event} type
    * @param {any} [detail] Event.detail
    * @returns {emitter}
    */

    trigger: function (type, detail) {
        return this;

    }


};



/**
* Add an event listener (global)
* @param {string} type
* @param {function} listener
* @param {boolean|Object} [options]
* @returns {emitter}
*/
emitter.on = function (type, listener, options) {

    return emitter().on(type, listener, options);

};
/**
* Add an event listener to be triggered once (global)
* @param {string} type
* @param {function} listener
* @param {boolean|Object} [options]
* @returns {emitter}
*/
emitter.one = function (type, listener, options) {
    return emitter().one(type, listener, options);
};
/**
* Removes an event listener (Global)
* @param {string} type
* @param {function} [listener]
* @param {boolean} [capture]
* @returns {emitter}
*/
emitter.off = function (type, listener, capture) {
    return emitter().off(type, listener, capture);
};
/**
* Dispatches an event (Global)
* @param {string|Event} type
* @param {any} [detail] Event.detail
* @returns {emitter}
*/

emitter.trigger = function (type, detail) {
    return emitter().trigger(type, detail);
};

const root = { emitter };

