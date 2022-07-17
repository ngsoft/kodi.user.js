/** emitter.js */
(function (root, factory) {
    /* globals define, require, module, self, exports, EventTarget */
    let name = 'emitter', deps = ['utils'];
    if (typeof define === 'function' && define.amd) {
        define(name, deps, factory);
    } else if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = factory(...deps.map(d => require(d)));
    } else {
        root[name] = factory(...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function (utils, undef) {

    const { global, isPlainObject, isString, isFunction, isBool } = utils;

    const { document } = global;


    /**
     * @param {string|EventTarget|undefined} target
     * @param {Object} [binding]
     * @returns
     */
    function emitter(target, binding) {

        if (!(this instanceof emitter)) {
            return new emitter(target, binding);
        }

        let t = this;

        if (isString(target)) target = document.querySelector(target);
        if (!(target instanceof EventTarget)) {
            binding = target;
            target = document.createElement('div');
        }


        if (binding instanceof Object && !(binding instanceof EventTarget)) {
            ["on", "off", "one", "trigger"].forEach(method => {
                binding[method] = binding[method] || function (...args) {
                    t[method](...args);
                    return binding;
                };
            });
        }

        this._target = target;
        // keep trace of the listeners
        if (!target._emitter) {
            Object.defineProperty(target, '_emitter', {
                enumerable: false, configurable: true, writable: true, value: {}
            });
        }

        this._events = target._emitter;

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

            if (!isString(type)) {
                throw new Error('Invalid event type.');
            }
            if (!isFunction(listener)) {
                throw new Error('Invalid event listener.');
            }

            let params = {
                once: false, capture: false
            };

            if (isBool(options)) {
                params.capture = options;
            } else if (isPlainObject(options)) {
                Object.assign(params, options);
            }

            // in some cases {once: true} does not work
            let handler = listener;

            if (params.once) {
                handler = e => {
                    this.off(e.type, listener, params.capture);
                    listener.call(this._target, e);
                };
            }


            type.split(/\s+/).forEach(t => {
                this._events[t] = this._events[t] || [];

                this._events[t].push({
                    type: t,
                    listener: listener,
                    handler: handler,
                    options: params
                });
                this._target.addEventListener(t, handler, params);

            });
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
            let params = {
                once: true, capture: false
            };
            if (isBool(options)) {
                params.capture = options;
            } else if (isPlainObject(options)) {
                params.capture = options.capture === true;
            }

            return this.on(type, listener, params);
        },

        /**
         * Removes an event listener
         * @param {string} type
         * @param {function} [listener]
         * @param {boolean} [capture]
         * @returns {emitter}
         */
        off: function (type, listener, capture) {
            if (!isString(type)) {
                throw new Error('Invalid event type.');
            }

            if (!isFunction(listener)) {
                capture = listener;
            }

            if (!isBool(capture)) capture = false;
            type.split(/\s+/).forEach(t => {

                if (Array.isArray(this._events[t])) {
                    this._events[t] = this._events[t].filter(obj => {

                        if (t === obj.type && capture === obj.options.capture) {
                            if (!isFunction(listener) || listener === obj.listener) {
                                this._target.removeEventListener(obj.type, obj.handler, obj.options.capture);
                                return false;
                            }
                        }
                        return true;
                    });
                }


            });

            return this;
        },

        /**
         * Dispatches an event
         * @param {string|Event} type
         * @param {any} [detail] Event.detail
         * @returns {emitter}
         */

        trigger: function (type, detail) {

            let event;
            if (detail === undef) detail = {};
            if (type instanceof Event) {
                event = type;
                event.detail = detail;
                this._target.dispatchEvent(event);
                return this;
            }

            if (!isString(type)) {
                throw new Error('Invalid event type.');
            }

            let eventInit = {
                bubbles: false,
                cancelable: true
            };
            if (this._target.parentElement !== null) {
                eventInit.bubbles = true;
            }

            type.split(/\s+/).forEach(t => {
                event = new Event(t, eventInit);
                event.detail = detail;
                this._target.dispatchEvent(event);
            });

            return this;

        }


    };


    Object.assign(emitter, {
        /**
         * Add an event listener (global)
         * @param {string} type
         * @param {function} listener
         * @param {boolean|Object} [options]
         * @returns {emitter}
         */
        on: function (type, listener, options) {
            return emitter(global).on(type, listener, options);
        },
        /**
         * Add an event listener to be triggered once (global)
         * @param {string} type
         * @param {function} listener
         * @param {boolean|Object} [options]
         * @returns {emitter}
         */
        one: function (type, listener, options) {
            return emitter(global).one(type, listener, options);
        },
        /**
         * Removes an event listener (Global)
         * @param {string} type
         * @param {function} [listener]
         * @param {boolean} [capture]
         * @returns {emitter}
         */
        off: function (type, listener, capture) {
            return emitter(global).off(type, listener, capture);
        },
        /**
         * Dispatches an event (Global)
         * @param {string|Event} type
         * @param {any} [detail] Event.detail
         * @returns {emitter}
         */

        trigger: function (type, detail) {
            return emitter(global).trigger(type, detail);
        }
    });

    return emitter;

}));
