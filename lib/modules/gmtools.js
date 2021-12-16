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

}(typeof self !== 'undefined' ? self : this, function (exports, undef) {

    let
        root = typeof self !== 'undefined' ? self : this,
        global = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window,
        { document, JSON } = global,
        comments = root.GM_info.script.header,
        RE_BLOCK = /(?:[\/]{2,}\s*==UserScript==\n*)([\s\S]*)(?:[\/]{2,}\s*==\/UserScript==\n*)/,
        RE_PROP = /[\/]{2,}[ \t]*@([\w\-\:]+)[ \t]*(.*)\n*/g,
        RE_KEY_VAL = /^(\S+)[ \t]+(\S+)$/,
        UNIQUE_TAGS = [
            'version', 'name', 'description', 'author',
            'namespace', 'homepage', 'homepageURL', 'website', 'source',
            'icon', 'iconURL', 'defaulticon', 'icon64', 'icon64URL',
            'run-at', 'noframes',
            'supportURL', 'updateURL', 'downloadURL'
        ],
        BUILTIN_TAGS = [
            'version', 'name', 'description', 'author',
            'namespace', 'homepage', 'homepageURL', 'website', 'source',
            'icon', 'iconURL', 'defaulticon', 'icon64', 'icon64URL',
            'nocompat', 'run-at', 'noframes', 'grant',
            'resource', 'require',
            'supportURL', 'updateURL', 'downloadURL', 'antifeature',
            'include', 'match', 'exclude', 'connect',
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


    /**
     * Test if given argument is a plain object
     * @param {any} v
     * @returns {Boolean}
     */
    function isPlainObject(v) {
        return v instanceof Object && Object.getPrototypeOf(v) === Object.prototype;
    }


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
                if (nval) {
                    div.dispatchEvent(Object.assign(new Event('valuechange', { bubbles: false, cancelable: true }), {
                        detail: {
                            name: name,
                            prev: oval && JSON.parse(oval),
                            value: JSON.parse(nval),
                            remote: remote === true
                        }
                    }));
                }
            };

            let id = exports.addValueChangeListener(name, handler);
            valueChangeListeners[name].push({
                id: id,
                listener: callback,
                handler: handler,
                name: name
            });

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
                    div.removeEventListener('valuechange', item.handler);
                    exports.GM_removeValueChangeListener(item.id);
                    return false;
                }
                return true;
            });
            return true;
        }
        return false;

    };

}));
