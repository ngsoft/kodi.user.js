/** utils.js */
(function (root, factory) {
    /* globals define, require, module, self, exports */
    let name = 'utils', deps = [];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        factory(root[name] = {}, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function (exports) {

    const global = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const { document, JSON } = global;



    const
        RE_NUMERIC = /^\d?\.?\d+$/,
        isPlainObject = param => param instanceof Object && Object.getPrototypeOf(param) === Object.prototype,
        isUndef = param => typeof param === "undefined",
        isString = param => typeof param === "string",
        isNumber = param => typeof param === "number",
        isInt = param => Number.isInteger(param),
        isFloat = (param) => isNumber(param) && !isInteger(param) && !isNaN(param),
        isNumeric = param => isInt(param) || isFloat(param) || RE_NUMERIC.test(param),
        intVal = param => isNumeric(param) && parseInt(param),
        floatVal = param => isNumeric(param) && parseFloat(param),
        isBool = param => typeof param === "boolean",
        isArray = param => Array.isArray(param),
        isNull = param => param === null,
        isObject = param => typeof param === "object" && !isNull(param),
        isCallable = param => typeof param === "function",
        isFunction = isCallable,
        isScalar = param => isNumeric(param) || isString(param) || isBool(param),
        isEmpty = param => !param || (isArray(param) && param.length === 0) || (isPlainObject(param) && Object.keys(param) === 0);


    /**
     * Creates an Element
     * 
     * @param {string} tagName 
     * @param {Object} [attributes]
     * @param {string} [innerHTML]
     * @returns {HTMLElement}
     */
    function createElement(tagName = 'div', attributes = null, innerHTML = '') {

        attributes = isPlainObject(attributes) ? attributes : {};


        let
            elem = document.createElement(tagName),
            props = Object.keys(attributes), prop;

        for (let i = 0; i < props.length; i++) {
            prop = props[i];
            if (prop === 'html') continue;

            if (prop === 'data' && isPlainObject(attributes[prop])) {
                Object.keys(attributes[prop]).forEach(key => {
                    elem.dataset[key] = attributes[prop][key];
                });
                continue;
            } else if (prop.indexOf('data-') === 0) {
                let key = prop.replace(/^data\-/, '');
                elem.dataset[key] = attributes[prop];
                continue;
            }

            if (typeof attributes[prop] !== "string") elem[prop] = attributes[prop];
            else elem.setAttribute(prop, attributes[prop]);
        }
        if (innerHTML.length > 0)
            elem.innerHTML = innerHTML;


        return elem;

    }

    /**
     * Generate a unique ID
     * @returns {String}
     */
    function uniqid() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }









    Object.assign(exports, {
        isPlainObject, isUndef,
        isString, isNumber, isNumeric, isBool, isScalar,
        isInt, isFloat, intVal, floatVal, isNaN: global.isNaN, isEmpty,
        isArray, isNull, isObject, isCallable, isFunction,
        createElement, uniqid, JSON, global, document



    });

}));
