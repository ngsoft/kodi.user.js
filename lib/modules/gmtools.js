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
            RE_KEY_VAL = /(\S+)[ \t]+(\S+)$/,
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
