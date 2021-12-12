/** emitter.js */
(function (root, factory) {
    /* globals define, require, module, self, exports,EventTarget */
    let name = 'emitter', deps = ['gmtools'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        let result, exports = root[name] = {};
        result = factory(exports, ...deps.map(d => root[d]));
        if (typeof result !== 'undefined') root[name] = result;
    }

}(typeof self !== 'undefined' ? self : this, function (exports, gmtools, undef) {

    const { window } = gmtools.window;
    const { document } = { window };

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

        if (target === undef) target = window;
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

            type.split(/\s+/).forEach(t => {
                this._events.push({
                    type: t,
                    listener: listener,
                    options: params
                });
                this._target.addEventListener(type, listener, params);

            });
            return this;
        },
        /**
         * Add an event listener
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
            return this.on(type, listener, options);
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

                    if (t === obj.type && capture === obj.params.capture) {
                        if (typeof listener !== "function" || listener === obj.listener) {
                            this._target.removeEventListener(obj.type, obj.listener, obj.params.capture);
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






    return emitter;

}));
