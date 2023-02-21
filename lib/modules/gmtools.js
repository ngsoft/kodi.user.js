/** gmtools.js */
(function (root, factory) {
    /* globals define, require, module, self, exports, unsafeWindow */
    let name = 'gmtools', deps = ['utils', 'execute'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        let result, exports = root[name] = {};
        result = factory(exports, ...deps.map(d => root[d]));
        if (typeof result !== 'undefined') root[name] = result;
    }

}(typeof self !== 'undefined' ? self : this, function (exports, utils, GM_execute, undef) {

    let
        root = typeof self !== 'undefined' ? self : this,
        { global, document, uniqid, createElement, isString } = utils,
        comments = root.GM_info.script.header,
        RE_BLOCK = /(?:[\/]{2,}\s*==UserScript==\n*)([\s\S]*)(?:[\/]{2,}\s*==\/UserScript==\n*)/,
        RE_PROP = /[\/]{2,}[ \t]*@([\w\-\:]+)[ \t]*(.*)\n*/g,
        RE_KEY_VAL = /^(\S+)[ \t]+(\S+)$/,
        UNIQUE_TAGS = [
            'version', 'name', 'description', 'author',
            'namespace', 'homepage', 'homepageURL', 'website', 'source',
            'icon', 'iconURL', 'defaulticon', 'icon64', 'icon64URL',
            'run-at', 'noframes', 'debug',
            'supportURL', 'updateURL', 'downloadURL'

        ],
        BUILTIN_TAGS = [
            'version', 'name', 'description', 'author',
            'namespace', 'homepage', 'homepageURL', 'website', 'source',
            'icon', 'iconURL', 'defaulticon', 'icon64', 'icon64URL',
            'nocompat', 'run-at', 'noframes', 'grant',
            'resource', 'require',
            'supportURL', 'updateURL', 'downloadURL', 'antifeature',
            'include', 'match', 'exclude', 'connect'
        ],
        matches,
        // grants
        supports = [],
        //valuechange
        valueChangeListeners = {},
        div = document.createElement('div'),

        // set into metadata.prototype
        metadata = (new class {
            setProperty(prop, value) {
                if (typeof prop === "string") {
                    if (typeof value === "string") this[prop] = value.length > 0 ? value : true;
                    else this[prop] = value;
                }
                return this;
            }
            addProperty(prop, value, index) {
                if (typeof prop === "string" && typeof value === "string") {
                    if (isUnique(prop)) {
                        this.setProperty(prop, value);
                    } else if (typeof index === "string") {
                        this[prop] = this[prop] || {};
                        this[prop][index] = value;
                    } else {
                        this[prop] = this[prop] || [];
                        this[prop].push(value);
                    }
                }
                return this;
            }
            getProperty(prop) {
                return this[prop];
            }
        }());




    function isBuiltin(tag) {
        return BUILTIN_TAGS.includes(tag);
    }

    function isUnique(tag) {
        return UNIQUE_TAGS.includes(tag);
    }


    // Userscript Header
    if ((matches = RE_BLOCK.exec(comments))) {
        let tag, val, block = matches[1], m, added = [];

        while ((matches = RE_PROP.exec(block))) {
            [, tag, val] = matches;
            val = val.trim();
            if (!isUnique(tag) && (m = RE_KEY_VAL.exec(val))) {
                metadata.addProperty(tag, m[2], m[1]);
            } else metadata.addProperty(tag, val);
            if (!added.includes(tag)) added.push(tag);
        }

        for (let i = 0; i < added.length; i++) {
            let tag = added[i];
            if (!isBuiltin(tag) && Array.isArray(metadata[tag]) && metadata[tag].length === 1) {
                metadata.setProperty(tag, metadata[tag][0]);
            }
        }
    }

    exports.metadata = metadata;



    exports.info = root.GM_info;

    // Application Programming Interface

    function notImplemented(method) {
        return function () {
            throw new Error(method + ' not implemented, please set @grant ' + method);
        };
    }


    /**
     * Adds CSS to the bottom of the head
     * @param {string} css
     * @returns {undefined}
     */
    function addStyle(css = '') {
        let
            elem = createElement('style', { type: 'text/css', id: '1.' + uniqid() }, isString(css) ? css : ''),
            head = document.getElementsByTagName('head')[0];
        head.appendChild(elem);
        return elem;
    }

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
        if (root[method]) {
            supports.push(method);
            exports[newmethod] = root[method];
        } else exports[newmethod] = notImplemented(method);
    });

    exports.execute = GM_execute;
    supports.push('GM_execute');

    let debug = metadata.getProperty('debug') === true;

    exports.debug = function (...messages) {
        if (debug) console.debug(...messages);
    };



    exports.supports = function (...args) {
        let result = true;
        result = supports.includes(...args) && result;
        return result;

    };

    // unsafeWindow
    exports.window = global;

    // valueChange
    exports.onValueChange = function (name, callback) {
        if (
            typeof name === "string" && typeof callback === "function" &&
            exports.supports('GM_removeValueChangeListener', 'GM_addValueChangeListener')
        ) {

            valueChangeListeners[name] = valueChangeListeners[name] || [];

            let handler = (name, oval, nval, remote) => {

                nval = nval === undef ? null : nval;
                div.dispatchEvent(Object.assign(new Event('valuechange', { bubbles: false, cancelable: true }), {
                    detail: {
                        name: name,
                        value: nval,
                        remote: remote === true
                    }
                }));

            };

            let id = exports.addValueChangeListener(name, handler);
            valueChangeListeners[name].push({
                id: id,
                listener: callback,
                handler: handler,
                name: name
            });


            div.addEventListener('valuechange', callback);

            return true;
        }

        return false;
    };


    exports.offValueChange = function (name, callback) {

        if (
            typeof name === "string" && valueChangeListeners[name] &&
            exports.supports('GM_removeValueChangeListener')
        ) {

            valueChangeListeners[name] = valueChangeListeners[name].filter(item => {
                if (callback === item.listener || callback === undef) {
                    div.removeEventListener('valuechange', item.listener);
                    exports.GM_removeValueChangeListener(item.id);
                    return false;
                }
                return true;
            });
            return true;
        }
        return false;

    };


    // polyfills
    exports.addStyle = root.GM_addStyle || addStyle;

    exports.getResource = function (resourceName) {



        if (typeof resourceName !== 'string') {
            throw new Error('Invalid argument resourceName');
        }

        if (metadata.resource && metadata.resource[resourceName]) {
            let result = metadata.resource[resourceName];
            if (exports.supports('GM_getResourceURL')) {
                result = exports.getResourceURL(resourceName);
            } else if (exports.supports('GM_getResourceText')) {
                let mime;

                try {
                    result = 'data:text/' + /\.(\w+)(?:[?#].*)?$/.exec(result)[1] + ';base64,' + btoa(exports.getResourceText(resourceName));
                } catch (e) {
                }


            }

            return result;
        }
    };


    exports.resource = (new class {

        loadCSS(resourceName, id, root){

            let link = exports.getResource(resourceName);

            if (link) {
                let elem = createElement('link', {
                    rel: 'stylesheet',
                    type: 'text/css',
                    href: link,
                    crossorigin: "anonymous",
                    referrerpolicy: "no-referrer"
                });


                elem.id = id || uniqid();

                root = root || document.head;

                root.appendChild(elem);

                return elem;
            }

        }



    }());

    exports.menu = (new class {


        constructor() {
            this._items = {};
        }

        addItem(title, callback, name) {

            if (typeof title !== "string") {
                throw new Error('Invalid title.');
            }

            if (typeof callback !== "function") {
                throw new Error('Invalid callback');
            }

            name = typeof name === "string" ? name : uniqid();

            if (this._items[name]) {
                this.removeItem(name);
            }


            this._items[name] = {
                callback: callback,
                title: title,
                name: name,
                id: exports.registerMenuCommand(title, callback)
            };
        }


        removeItem(name) {
            if (this._items[name]) {
                exports.unregisterMenuCommand(this._items[name].id);
                delete this._items[name];
            }
        }


        clear() {
            let keys = Object.keys(this._items), name;
            while ((name = keys.pop())) {
                this.removeItem(name);
            }

        }

    }());







}));
