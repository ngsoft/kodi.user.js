/** gmtools.js */
(function(root, factory){
    let
            name = 'gmtools',
            deps = [];

    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else factory((root[name] = {}), ...deps.map(d => root[d]));

}(typeof self !== 'undefined' ? self : this, function(exports){

    let
            root = typeof self !== 'undefined' ? self : this,
            comments = root.GM_info.script.header,
            metadata = {},
            RE_BLOCK = /(?:[\/]{2,}\s*==UserScript==\n*)(.*)(?:[\/]{2,}\s*==\/UserScript==\n*)/s,
            RE_PROP = /[\/]{2,}[ \t]*@([\w\-]+)[ \t]*(.*)\n*/g,
            RE_KEY_VAL = /(\w+)\s+(.*)$/,
            KEY_VALUES = /^(resource|antifeature)/,
            ARRAY_TAGS = /^(include|match|exclude|require|connect|grant|nocompat)/,
            matches;


    // Userscript Header
    if (matches = RE_BLOCK.exec(comments)) {
        let block, prop, val;
        block = matches[1];

        while (matches = RE_PROP.exec(block)) {
            [, prop, val] = matches;
            val = val.trim();

            if (KEY_VALUES.test(prop)) {
                if (matches = RE_KEY_VAL.exec(val)) {
                    val = {};
                    val[matches[1]] = matches[2].trim();
                    metadata[prop] = metadata[prop] || {};
                    Object.assign(metadata[prop], val);
                }
                continue;
            }else if(ARRAY_TAGS.test(prop)){
                metadata[prop] = metadata[prop] || [];
                metadata[prop].push(val);
                continue;
            }
            if (val == "") val = true;
            metadata[prop] = val;
        }
    }


    function notImplemented(method){
        return function(){
            throw new Error(method + ' not implemented, please set @grant ' + method);
        }
    }



    exports.metadata = metadata;

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

        console.debug(method, newmethod);
        exports[newmethod] = root[method] || notImplemented(method);


    });


    // unsafeWindow
    exports.window = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;









    

    /* Object.assign(exports, {
        metadata,



    });*/
}));
