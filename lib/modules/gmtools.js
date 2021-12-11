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

    exports.metadata = metadata;

    // Application Programming Interface
    exports.addStyle = root.GM_addStyle;
    exports.addElement = root.GM_addElement;
    exports.addElement = root.GM_addElement;
    exports.deleteValue = root.GM_deleteValue;
    exports.listValues = root.GM_listValues;
    exports.addValueChangeListener = root.GM_addValueChangeListener;
    exports.removeValueChangeListener = root.GM_removeValueChangeListener;
    exports.setValue = root.GM_setValue;
    exports.getValue = root.GM_getValue;
    exports.log = root.GM_log;
    exports.getResourceText = root.GM_getResourceText;
    exports.getResourceURL = root.GM_getResourceURL;
    exports.registerMenuCommand = root.GM_registerMenuCommand;
    exports.unregisterMenuCommand = root.GM_unregisterMenuCommand;
    exports.openInTab = root.GM_openInTab;
    exports.xmlhttpRequest = root.GM_xmlhttpRequest;
    exports.download = root.GM_download;
    exports.getTab = root.GM_getTab;
    exports.saveTab = root.GM_saveTab;
    exports.getTabs = root.GM_getTabs;
    exports.notification = root.GM_notification;
    exports.setClipboard = root.GM_setClipboard;
    exports.info = root.GM_info;

    exports.window = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;









    

    Object.assign(exports, {
        metadata,



    });
}));
