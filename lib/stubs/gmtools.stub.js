
/**
 * Code stub for module gmtools.js
 */

const
    gmtools = {};


gmtools.metadata = {
    'name': '',
    'namespace': '',
    'version': '',
    'author': '',
    'description': '',
    'homepage': '',
    'homepageURL': '',
    'website': '',
    'source': '',
    'icon': '',
    'iconURL': '',
    'defaulticon': '',
    'icon64': '',
    'icon64URL': '',
    'updateURL': '',
    'downloadURL': '',
    'supportURL': '',
    'include': [],
    'match': [],
    'exclude': [],
    'require': [],
    'resource': {},
    'connect': [],
    'run-at': '',
    'grant': [],
    'antifeature': {},
    'noframes': false,
    'nocompat': []

};

/**
 * Execute Code
 *
 * @param {string} code
 * @param {Object} [context]
 * @returns {Promise}
 */
function GM_execute(code, context) {
    return new Promise();
}

gmtools.execute = GM_execute;

const GM_addStyle = gmtools.addStyle = function (css) {
    return document.createElement('style');
};

const GM_addElement = gmtools.addElement = function (parent_node, tag_name, attributes) {
    return document.createElement(tag_name);
};
const GM_deleteValue = gmtools.deleteValue = function (name) { };
const GM_listValues = gmtools.listValues = function () {
    return [];
};
const GM_addValueChangeListener = gmtools.addValueChangeListener = function (name, callback) {
    return 1;
};
const GM_removeValueChangeListener = gmtools.removeValueChangeListener = function (listener_id) { };
const GM_setValue = gmtools.setValue = function (name, value) { };
const GM_getValue = gmtools.getValue = function (name, defaultValue) {
    return '';
};
const GM_log = gmtools.log = function (message) { };
const GM_getResourceText = gmtools.getResourceText = function (name) {
    return '';
};
const GM_getResourceURL = gmtools.getResourceURL = function (name) {
    return '';
};
const GM_registerMenuCommand = gmtools.registerMenuCommand = function (name, fn, accessKey) {
    return 1;
};
const GM_unregisterMenuCommand = gmtools.unregisterMenuCommand = function (menuCmdId) { };
const GM_openInTab = gmtools.openInTab = function (url, options) {
    return {};
};
const GM_xmlhttpRequest = gmtools.xmlhttpRequest = function (details) {
    return {
        abort: function () { }
    };
};
const GM_download = gmtools.download = function (details) {
    return {
        abort: function () { }
    };
};
const GM_getTab = gmtools.getTab = function (callback) {
    return {};
};
const GM_saveTab = gmtools.saveTab = function (tab) { };
const GM_getTabs = gmtools.getTabs = function (callback) { };
const GM_notification = gmtools.notification = function (details, ondone) { };
const GM_setClipboard = gmtools.setClipboard = function (data, info) { };
const GM_info = gmtools.info = {
    script: {
        author: "",
        copyright: "",
        description: "",
        excludes: [],
        homepage: null,
        icon: null,
        icon64: null,
        includes: [],
        lastUpdated: 0,
        matches: [],
        downloadMode: 'browser',
        name: "",
        namespace: "",
        uuid: "",
        options: {
            awareOfChrome: true,
            compat_arrayleft: false,
            compat_foreach: false,
            compat_forvarin: false,
            compat_metadata: false,
            compat_prototypes: false,
            compat_uW_gmonkey: false,
            noframes: false,
            override: {
                excludes: false,
                includes: false,
                orig_excludes: [],
                orig_includes: [],
                use_excludes: [],
                use_includes: []
            },
            'run_at': ""
        },
        position: 1,
        resources: [],
        'run-at': "",
        system: false,
        unwrap: false,
        version: "1.0.0"

    },
    scriptMetaStr: "",
    scriptSource: "",
    scriptUpdateURL: "",
    scriptWillUpdate: false,
    scriptHandler: "Tampermonkey",
    isIncognito: false,
    isFirstPartyIsolation: false,
    version: "4.0.25"

};


gmtools.window = window;

/**
 * Add a value change listener
 * @param {String} name value name
 * @param {function} callback listener
 * @returns {Boolean}
 */
gmtools.onValueChange = function (name, callback) {
    return false;
};

/**
 * Removes a value change listener
 *
 * @param {String} name value name
 * @param {Function} [callback] listener
 * @returns {Boolean}
 */
gmtools.offValueChange = function (name, callback) {
    return false;
};




/**
 * Checks if capability has been granted
 * @param {string} ...args
 * @returns {Boolean}
 */
gmtools.supports = function (...args) { return false; };


/**
 * Get resource url by name
 *
 * @param {string} name
 * @returns {String|undefined}
 */
gmtools.getResource = function (name) {
    return '';
};



gmtools.menu = {
    /**
     * Add a context menu items
     * @param {string} title
     * @param {function} callback
     * @param {string} [name]
     * @returns {undefined}
     */
    addItem(title, callback, name) { },
    /**
     * Removes an item
     * @param {string} name
     * @returns {undefined}
     */
    removeItem(name) { },
    /**
     * Removes all items
     * @returns {undefined}
     */
    clear() { }
};

const root = { gmtools }, unsafeWindow = window;