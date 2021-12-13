// ==UserScript==
// @version     21.12.7
// @name        KodiCast
// @description Cast your streams to Kodi
// @author      Aymeric Anger
// @namespace   https://github.com/ngsoft/kodi.user.js
//
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEAklEQVR42rVXv4/cRBRee3fvghSIsnd+45UQPZQUJLT8D9TUqSOlAoIoAgU/FYQIhBqC9uJ5s4sijoqaAhBFDtCl4Ow3eyL05O58Rva8sWe8vkSXvbW0Wlvr9ffN9733zXOvd8pDIAX2HJDeBqSPxUQPy+tIUthb5dEC/wSQCoFUgKTkfJJWJGBVJGKVtcB1IZQ+BKUfVSSQ8PyWIRFhdrYkRCc4HQHScfkpiVgSG1v7g5XZAUifVrIrfWSAq/OiItKQSJ6zSsjGsqVXD0jXS/ASiFddOApU5wKr38rz70bf/js8s5Vv3H0QAtKfDHQEqrKgAq4+LomqLqiIkF5j4stbcUE9CEHRHwJ1AYpyYSR3QY9bNqjonl53rAtO67X3h2cNgZ2aAK/ckb+8PmDwe5uT/bWu1Z+aSG3BpLJgh8HyFnj5fcDeb4utOYNnfQf45ejuw/5jLXHZCaS3AOml+vqb3VAg7YDxO3dkLxzwH+NJeo7DaOA893P+/c5omg2ZXNgCd/pc0Ycm4bJXTRfoEJLdkxQw4JK2x13gkm4xyZxJ4MVZ6pMQsgGPUH/AFV6Ayl4xasxDoXZDoeg+B1DeWvn25p1/1rnvu8CPmHQdVhe/TwcLdgik9/kPh6zAJaPAPASsFLjvKGDBfxhN9quVR0knuJ8ZLglMhw54dqNhq3NzExNAQ6BRQD+yno9VLbtbcF/4ablQsHViAs4H5crfFCbhrFSmuGR22VikQ1CeAj44Ul+wn6D0dVC1PV3gVomDymakWyX7G6KRa4EAyHko8K9Sgd+t52OVPuO2WjxNbYu9K9AlUN5vAovDyytegfS1le1mQ8K3IOb2BEUakH6K5d66BRdKB88ne4E7AwDS7Wa39NLSkqjT8kLy95qbA5+JjiKMcS8YzR6GgPoNkNmIwQcLOeLVgb79hCKcisSkpbdlNiSaNgTVPJh3R7fg3gOkCUiKmcRwkUQ1N+S8i1pwf3rqIgFIl7k9+0wkAAdcKK52c+8vGzIb87NcEl/ZIBLmXgUzBkd/Yb3ICSSQ9I6Q+kVzroP2VGTBwYxk/zGJ3zZkFptAa0hESF+CqfitSM3XHrsfnDTBePuEcvq8nAkMkYMOEk0wKX1pPNsbsqJPng/ENA269gkH/LAcSDiYjsEn8WuExg5A3T9pqn6aefAm97VZOU9FXN1tEj9HqDd5fwlA6eVmQyFpE5AO7Ujm9fbJs8HrXLzLjWQxpjyU6qtVzGK5Wp3XKeeETJMhlIxn2foKxnJ9zSNhZK9DhsGnwCGzlOeL47mRsiZhijB347UFfvYvJkJRUJOwwwm/mnngq3o/LCvabr0R0jUnCZUD3u+t+nhhuh9wSl4BpI9A0rmnfTP+H3tBubRZKHwCAAAAAElFTkSuQmCC
//
// @run-at      document-end
// @noframes
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_addValueChangeListener
// @grant       GM_removeValueChangeListener
// @grant       GM_notification
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @grant       GM_setClipboard
//
// @resource    iziToastCSS https://cdn.jsdelivr.net/npm/izitoast/dist/css/iziToast.css
// @require     https://cdn.jsdelivr.net/gh/mathiasbynens/utf8.js/utf8.js
// @require     https://cdn.jsdelivr.net/npm/izitoast/dist/js/iziToast.js
// @require     https://cdn.jsdelivr.net/gh/mitchellmebane/GM_fetch@master/GM_fetch.js
//
// @include     *
// @connect     *
// ==/UserScript==
/** gmtools.js */
(function (root, factory) {
    /* globals define, require, module, self, exports, unsafeWindow */
    let name = 'gmtools', deps = [];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        let result, exports = root[name] = {};
        result = factory(exports, ...deps.map(d => root[d]));
        if (typeof result !== 'undefined') root[name] = result;
    }

}(typeof self !== 'undefined' ? self : this, function (exports) {

    let
        root = typeof self !== 'undefined' ? self : this,
        global = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window,
        comments = root.GM_info.script.header,
        metadata = {},
        RE_BLOCK = /(?:[\/]{2,}\s*==UserScript==\n*)([\s\S]*)(?:[\/]{2,}\s*==\/UserScript==\n*)/,
        RE_PROP = /[\/]{2,}[ \t]*@([\w\-]+)[ \t]*(.*)\n*/g,
        RE_KEY_VAL = /(\w+)\s+(.*)$/,
        KEY_VALUES = /^(resource|antifeature)/,
        ARRAY_TAGS = /^(include|match|exclude|require|connect|grant|nocompat)/,
        matches;




    // Userscript Header
    if ((matches = RE_BLOCK.exec(comments))) {
        let block, prop, val;
        block = matches[1];

        while ((matches = RE_PROP.exec(block))) {
            [, prop, val] = matches;
            val = val.trim();

            if (KEY_VALUES.test(prop)) {
                if ((matches = RE_KEY_VAL.exec(val))) {
                    val = {};
                    val[matches[1]] = matches[2].trim();
                    metadata[prop] = metadata[prop] || {};
                    Object.assign(metadata[prop], val);
                }
                continue;
            } else if (ARRAY_TAGS.test(prop)) {
                metadata[prop] = metadata[prop] || [];
                metadata[prop].push(val);
                continue;
            }
            if (val == "") val = true;
            metadata[prop] = val;
        }
    }

    exports.metadata = metadata;


    function notImplemented(method) {
        return function () {
            throw new Error(method + ' not implemented, please set @grant ' + method);
        };
    }





    exports.info = root.GM_info;

    // Application Programming Interface

    [

        'GM_addStyle',
        'GM_addElement',
        'GM_addElement',
        'GM_deleteValue',
        'GM_listValues',
        'GM_addValueChangeListener',
        'GM_removeValueChangeListener',
        'GM_setValue',
        'GM_getValue',
        'GM_log',
        'GM_getResourceText',
        'GM_getResourceURL',
        'GM_registerMenuCommand',
        'GM_unregisterMenuCommand',
        'GM_openInTab',
        'GM_xmlhttpRequest',
        'GM_download',
        'GM_getTab',
        'GM_saveTab',
        'GM_getTabs',
        'GM_notification',
        'GM_setClipboard'
    ].forEach(method => {
        let newmethod = method.replace(/^GM_/, '');
        exports[newmethod] = root[method] || notImplemented(method);
    });


    // unsafeWindow
    exports.window = global;


    // run-at

    exports.runAt = {

        documentStart: function () {
            // do nothing
            return new Promise(rsl => {
                rsl(document);
            });

        },

        documentBody: function () {

            return new Promise(rsl => {

                let fn = (mut, obs) => {
                    let body;
                    mut.forEach(m => {
                        m.addedNodes.forEach(node => {
                            if (typeof node.matches === 'function' && node.matches('body')) {
                                obs.disconnect();
                                body = node;
                            }
                        });
                    });
                    if (body) rsl(body);

                };

                if (document.body === null) {
                    const observer = new MutationObserver(fn);
                    observer.observe(document.documentElement, { childList: true });
                } else rsl(document.body);

            });

        },

        documentEnd: function () {

            return new Promise(rsl => {
                // some browsers, sites locks the events
                function worker() {
                    if (document.readyState === 'complete') {
                        rsl(document);
                        return;
                    }
                    setTimeout(() => {
                        worker();
                    }, 20);
                }
                worker();
            });



        },


        documentIdle: function () {
            return new Promise(rsl => {
                // some browsers, sites locks the events
                function worker() {
                    if (document.readyState !== 'loading') {
                        rsl(document);
                        return;
                    }
                    setTimeout(() => {
                        worker();
                    }, 20);
                }
                worker();
            });
        }



    };





}));

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
    const { document } = window;

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
                this._events[t] = this._events[t] || [];

                this._events[t].push({
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

                if (Array.isArray(this._events[t])) {
                    this._events[t] = this._events[t].filter(obj => {

                        if (t === obj.type && capture === obj.options.capture) {
                            if (typeof listener !== "function" || listener === obj.listener) {
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
            if (typeof detail === "undefined") detail = {};
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

/** storage.js */
(function (root, factory) {
    /* globals define, require, module, self, exports */
    let name = 'storage', deps = ['gmtools', 'emitter'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        let exports = root[name] = {};
        factory(exports, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function (exports, gmtools, emit, undef) {

    /**
     * Generate a unique ID
     * @returns {String}
     */
    function uniqid() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }


    let { JSON } = self;

    let { emitter } = emit;

    let
        globalStorage = {},
        instance = gmtools.info.script.uuid + ':' + uniqid();




    class ValueChangeEmitter {

        constructor() {
            this._listeners = {};
            this._prefix = gmtools.info.script.uuid + ':valuechange:' + this.constructor.name + ':';
            emitter(this);
        }

        get listeners() {
            return this._listeners;
        }

        get gmSupport() {

            if (typeof this._gmSupport === 'undefined') {
                this._gmSupport =
                    Array.isArray(gmtools.metadata.grant) &&
                    gmtools.metadata.grant.includes('GM_addValueChangeListener') &&
                    gmtools.metadata.grant.includes('GM_removeValueChangeListener') &&
                    gmtools.metadata.grant.includes('GM_setValue') &&
                    gmtools.metadata.grant.includes('GM_deleteValue');
            }

            return this._gmSupport;
        }




        onValueChange(name, listener) {

            if (typeof name !== 'string') {
                throw new Error('Invalid name: not a string');
            }
            if (typeof listener !== 'function') {
                throw new Error('Invalid event listener.');
            }

            let
                type = this._prefix + name,
                handler = e => {
                    if (e.detail && e.detail.instance) {
                        let detail = e.detail;
                        listener(detail.name, detail.oldValue, detail.newValue, detail.instance !== instance);
                    }
                },

                obj = {
                    name: name,
                    listener: listener,
                    handler: handler,
                    type: type
                };
            this._listeners[name] = this._listeners[name] || [];
            this._listeners[name].push(obj);
            // remote support
            if (this.gmSupport) {
                obj.id = gmtools.addValueChangeListener(type, (t, oldValue, newValue) => {
                    let detail = JSON.parse(newValue);
                    this.trigger(type, detail);
                    gmtools.deleteValue(detail.type);

                });
            }
            return this.on(type, handler);
        }

        offValueChange(name, listener) {
            if (typeof name !== 'string') {
                throw new Error('Invalid name: not a string');
            }

            let type = this._prefix + name;


            if (Array.isArray(this._listeners[name])) {
                this._listeners[name] = this._listeners[name].filter(obj => {
                    if (obj.type === type) {
                        if (typeof listener !== 'function' || listener === obj.listener) {
                            this.off(obj.type, obj.handler);
                            if (this.gmSupport) gmtools.removeValueChangeListener(obj.id);
                            return false;
                        }
                    }
                    return true;
                });
            }



            return this;

        }


        triggerValueChange(name, oldValue, newValue) {
            if (typeof name !== 'string') {
                throw new Error('Invalid name: not a string');
            }
            // no trigger if no events
            if (!this._listeners[name] || this._listeners[name].length === 0) return this;
            let type = this._prefix + name, detail = {
                name: name,
                type: type,
                oldValue: oldValue,
                newValue: newValue,
                instance: instance
            };
            if (this.gmSupport) {
                let value = JSON.stringify(detail);
                gmtools.setValue(type, value);
                return this;
            }
            return this.trigger(type, detail);
        }
    }











    class xStorage extends ValueChangeEmitter {


        constructor(store) {

            super();

            store = store || sessionStorage;
            if (!(store instanceof Storage)) {
                throw new Error('Invalid store: not instance of Storage');
            }
            this.storage = store;
            this.storeKey = gmtools.info.script.uuid + ':';


        }

        get(name, defaultValue) {

            return new Promise(rsl => {
                if (typeof name !== 'string') {
                    throw new Error('Invalid name: not a string');
                }

                name = this.storeKey + name;

                let value = this.storage.getItem(name);
                value = value === null ? defaultValue : value;
                if (typeof value === 'string' && value !== defaultValue) {
                    value = JSON.parse(value);
                }
                rsl(value);
            });

        }

        set(name, value) {
            return new Promise(rsl => {
                if (typeof name !== 'string') {
                    throw new Error('Invalid name: not a string');
                }

                if (value === undef) {
                    throw new Error('Invalid value: undefined');
                }

                this.get(name).then(oldValue => {
                    let
                        newName = this.storeKey + name,
                        json = JSON.stringify(value);
                    this.storage.setItem(newName, json);
                    this.triggerValueChange(name, oldValue, value);
                    rsl();

                });


            });
        }



        has(name) {
            return this.get(name).then(value => value !== undef);
        }



        remove(name) {
            return new Promise(rsl => {
                if (typeof name !== 'string') {
                    throw new Error('Invalid name: not a string');
                }

                this.get(name).then(oldValue => {
                    let newName = this.storeKey + name;
                    this.storage.removeItem(newName);
                    this.triggerValueChange(name, oldValue);
                    rsl();
                });


            });
        }



        clear() {
            return new Promise(rsl => {
                let name, i;
                for (i = 0; i < this.storage.length; i++) {
                    name = this.storage.key(i);
                    if (name.indexOf(this.storeKey) === 0) {
                        this.storage.removeItem(name);
                    }
                }
                rsl();
            });
        }


    }












    class GM_Storage extends ValueChangeEmitter {


        get(name, defaultValue) {

            return new Promise(rsl => {
                if (typeof name !== 'string') {
                    throw new Error('Invalid name: not a string');
                }
                let value = gmtools.getValue(name, defaultValue);
                if (typeof value === 'string' && value !== defaultValue) {
                    value = JSON.parse(value);
                }
                rsl(value);
            });

        }

        set(name, value) {
            return new Promise(rsl => {
                if (typeof name !== 'string') {
                    throw new Error('Invalid name: not a string');
                }

                if (value === undef) {
                    throw new Error('Invalid value: undefined');
                }

                this.get(name).then(oldValue => {
                    let json = JSON.stringify(value);
                    gmtools.setValue(name, json);
                    this.triggerValueChange(name, oldValue, value);
                    rsl();
                });

            });
        }



        has(name) {
            return this.get(name).then(value => value !== undef);
        }



        remove(name) {
            return new Promise(rsl => {
                if (typeof name !== 'string') {
                    throw new Error('Invalid name: not a string');
                }
                this.get(name).then(oldValue => {
                    gmtools.deleteValue(name);
                    this.triggerValueChange(name, oldValue);
                    rsl();
                });
            });
        }



        clear() {
            return new Promise(rsl => {
                gmtools.listValues().forEach(name => {
                    gmtools.deleteValue(name);
                });
                rsl();
            });
        }


    }


    class MemoryStorage extends ValueChangeEmitter {

        get storage() {
            return globalStorage[this.id];
        }

        constructor(id) {
            super();
            this.id = typeof id === 'string' ? id : uniqid();
            globalStorage[this.id] = globalStorage[this.id] || {};

        }
        get(name, defaultValue) {

            return new Promise(rsl => {
                if (typeof name !== 'string') {
                    throw new Error('Invalid name: not a string');
                }
                let value = this.storage[name] || defaultValue;
                if (typeof value === 'string' && value !== defaultValue) {
                    value = JSON.parse(value);
                }
                rsl(value);
            });

        }

        set(name, value) {
            return new Promise(rsl => {
                if (typeof name !== 'string') {
                    throw new Error('Invalid name: not a string');
                }

                if (value === undef) {
                    throw new Error('Invalid value: undefined');
                }

                this.get(name).then(oldValue => {
                    let json = JSON.stringify(value);
                    this.storage[name] = json;
                    gmtools.setValue(name, json);
                    this.triggerValueChange(name, oldValue, value);
                    rsl();
                });
            });
        }



        has(name) {
            return this.get(name).then(value => value !== undef);
        }



        remove(name) {
            return new Promise(rsl => {
                if (typeof name !== 'string') {
                    throw new Error('Invalid name: not a string');
                }
                this.get(name).then(oldValue => {
                    delete this.storage[name];
                    this.triggerValueChange(name, oldValue);
                    rsl();
                });
            });
        }



        clear() {
            return new Promise(rsl => {
                globalStorage[this.id] = {};
                rsl();
            });
        }
    }

    Object.assign(exports, {
        MemoryStorage,
        GM_Storage: new GM_Storage(),
        xsessionStorage: new xStorage(),
        xlocalStorage: new xStorage(localStorage)

    });

}));


/** nodefinder.js */
(function (root, factory) {
    /* globals define, require, module, self, exports, unsafeWindow, EventTarget */
    let name = 'nodefinder', deps = ['gmtools'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        let exports = root[name] = {};
        factory(exports, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function (exports, gmtools, undef) {


    const global = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const { document } = global;
    const { runAt } = gmtools;


    /**
     * Tests whenever the given selector is valid
     * @param {string} selector
     * @returns {Boolean}
     */
    function isValidSelector(selector) {
        if (typeof selector !== 'string') return false;
        let valid = true;
        try {
            //throws syntax error on invalid selector
            valid = document.createElement('template').querySelector(selector) === null;
        } catch (e) {
            valid = false;
        }
        return valid;
    }


    /**
     * Create a new search request
     * 
     * @param {EventTarget} root 
     * @param {string} selector 
     * @param {function} callback 
     * @returns 
     */
    function finderRequest(root, selector, callback) {

        if (!(this instanceof finderRequest)) {
            return new finderRequest(root, selector, callback);
        }


        if (typeof root === 'string') {
            callback = selector;
            selector = root;
            root = document;
        }

        if (!isValidSelector(selector)) {
            throw new Error('Invalid selector');
        }
        if (typeof callback !== "function") {
            throw new Error('Invalid callback');
        }
        this.root = root;
        this.selector = selector;
        this.callback = callback;
        this.nodes = [];
    }

    finderRequest.prototype = {
        forEach(callback) {
            if (typeof callback !== "function") {
                throw new Error('Invalid callback');
            }
            let i;

            for (i = 0; i < this.nodes.length; i++) {
                callback(this.nodes[i], i);
            }
            return this;

        },
        push(node) {
            if (node instanceof Element && !this.has(node) && this.root.contains(node) && node.matches(this.selector)) {
                this.nodes.push(node);
                return true;
            }
            return false;
        },

        has(node) {
            return this.nodes.includes(node);
        }


    };




    /**
     * Searches for uniques nodes as they are created
     * 
     * @param {EventTarget|finderRequest} [root] 
     */
    function finder(root) {

        if (!(this instanceof finder)) {
            return new finder(root);
        }

        let
            started = false,
            options = {
                attributes: true,
                childList: true,
                subtree: true
            },
            t = this, observer, request;


        if (root instanceof finderRequest) {
            request = root;
            root = request.root;
        }

        root = root instanceof EventTarget ? root : document.documentElement;

        observer = new MutationObserver(mut => {
            let node, newNodes = [],
                computeNode = node => {
                    if (!request || request.has(node) || newNodes.includes(node) || !started) return;
                    if (node instanceof Element && node.matches(request.selector)) newNodes.push(node);
                };
            //checks mutations
            mut.forEach(m => {
                node = m.target;
                computeNode(node);
                if (m.type === 'childList') {
                    [m.addedNodes, m.removedNodes].forEach(items => {
                        items.forEach(computeNode);
                    });
                }
            });
            // checks if new nodes have been added
            request.root.querySelectorAll(request.selector).forEach(computeNode);

            if (newNodes.length > 0) {
                while ((node = newNodes.shift())) {
                    if (request.push(node)) {
                        request.callback(node, t, request);
                    }
                    // abort()
                    if (!started) return;
                }
            }

        });


        function start() {
            if (started || !request) return t;
            started = true;
            runAt.documentIdle().then(() => {
                request.root.querySelectorAll(request.selector).forEach(node => {
                    // abort()
                    if (!started) return;
                    if (request.push(node)) {
                        request.callback(node, t, request);
                    }
                });
                // abort(), findOne fast ...
                if (started) observer.observe(request.root, options);
            });

            return t;

        }


        function abort() {
            if (started) {
                started = false;
                observer.disconnect();
                request = undef;
            }
            return t;
        }


        function find(selector, callback) {
            if (selector instanceof finderRequest) {
                request = selector;
            } else request = new finderRequest(root, selector, callback);
            return start();
        }

        function findOne(selector, callback) {

            if (typeof callback !== "function" && isValidSelector(selector)) {
                return new Promise(rsl => {
                    findOne(selector, node => {
                        rsl(node);
                    });
                });

            }

            let request;

            if (selector instanceof finderRequest) {
                request = selector;
            } else request = new finderRequest(root, selector, callback);

            return find(selector, node => {
                if (request.push(node)) {
                    request.callback(node, t, request);
                    abort();
                }
            });
        }



        this.find = find;
        this.findOne = findOne;
        this.abort = abort;

        if (request instanceof finderRequest) start();

    }


    finder.find = function (root, selector, callback) {

        if (!(root instanceof EventTarget)) {
            callback = selector;
            selector = root;
            root = document.documentElement;
        }

        let query = finder(root);
        return query.find(selector, callback);
    };

    finder.findOne = function (root, selector, callback) {

        if (!(root instanceof EventTarget)) {
            callback = selector;
            selector = root;
            root = document.documentElement;
        }

        let query = finder(root);
        return query.findOne(selector, callback);
    };







    exports.finder = finder;
    exports.finderRequest = finderRequest;


}));



/* globals self, unsafeWindow */

(function (global, root) {

    const {document} = global;



    nodefinder.finder.find('img', console.debug);
    nodefinder.finder.findOne('div').then(console.debug);











})(
    typeof unsafeWindow !== 'undefined' ? unsafeWindow : window,
    typeof self !== 'undefined' ? self : this
);


