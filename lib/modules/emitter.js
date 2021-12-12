/** emitter.js */
(function (root, factory) {
    /* globals define, require, module, self, exports,EventTarget */
    let name = 'emitter', deps = ['gmtools'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object') {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        let exports = root[name] = {};
        factory(exports, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function (exports, gmtools, undef) {

    const window = gmtools.window;
    const {document} = window;

    /**
     * Test if given argument is a plain object
     * @param {any} v
     * @returns {Boolean}
     */
    function isPlainObject(v) {
        return v instanceof Object && Object.getPrototypeOf(v) === Object.prototype;
    }

    /**
     * @param {string|EventTarget|undefined} target 
     * @param {Object} [binding]
     * @returns 
     */
    function emitter(target, binding) {

        if (!(this instanceof emitter)) {
            return new emitter(target);
        }

        let t = this;

        if (typeof target === 'string') target = document.querySelector(target);
        if (!(target instanceof EventTarget)) {
            binding = target;
            target = document.createElement('div');
        }


        if (binding instanceof Object && !(binding instanceof EventTarget)) {
            ["on", "off", "one", "trigger"].forEach(method => {
                binding[method] = binding[method] || function (...args) {
                    t[method].apply(binding, args);
                    return binding;
                };
            });
        }

        this._target = target;
        // keep trace of the listeners
        if (!target._emitter) {
            Object.defineProperty(target, '_emitter', {
                enumerable: false, configurable: true, writable: true, value: []
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


            if (typeof type !== 'string') {
                throw new Error('Invalid event type.');
            }
            if (typeof listener !== 'function') {
                throw new Error('Invalid event listener.');
            }

            let params = {
                once: false, capture: false
            };

            if (typeof options === "boolean") {
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
                this._events.push({
                    type: t,
                    listener: listener,
                    handler: handler,
                    options: params
                });
                this._target.addEventListener(type, handler, params);

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
            if (typeof options === "boolean") {
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
            if (typeof type !== 'string') {
                throw new Error('Invalid event type.');
            }

            if (typeof listener !== "function") {
                capture = listener;
            }

            if (typeof capture !== "boolean") capture = false;
            type.split(/\s+/).forEach(t => {

                this._events = this._events.filter(obj => {

                    if (t === obj.type && capture === obj.options.capture) {
                        if (typeof listener !== "function" || listener === obj.listener) {
                            this._target.removeEventListener(obj.type, obj.handler, obj.options.capture);
                            return false;
                        }
                    }
                    return true;
                });
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
            if (typeof detail !== "undefined") detail = {};
            if (type instanceof Event) {
                event = type;
                event.detail = detail;
                this._target.dispatchEvent(event);
                return this;
            }

            if (typeof type !== 'string') {
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
            return emitter(window).on(type, listener, options);
        },
        /**
         * Add an event listener to be triggered once (global)
         * @param {string} type
         * @param {function} listener
         * @param {boolean|Object} [options]
         * @returns {emitter}
         */
        one: function (type, listener, options) {
            return emitter(window).one(type, listener, options);
        },
        /**
         * Removes an event listener (Global)
         * @param {string} type
         * @param {function} [listener]
         * @param {boolean} [capture]
         * @returns {emitter}
         */
        off: function (type, listener, capture) {
            return emitter(window).off(type, listener, capture);
        },
        /**
         * Dispatches an event (Global)
         * @param {string|Event} type
         * @param {any} [detail] Event.detail
         * @returns {emitter}
         */

        trigger: function (type, detail) {
            return emitter(window).trigger(type, detail);
        }
    });








    exports.emitter = emitter;

}));