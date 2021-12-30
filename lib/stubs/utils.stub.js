
const
    isPlainObject = param => false,
    isUndef = param => false,
    isString = param => false,
    isNumber = param => false,
    isInt = param => false,
    isFloat = param => false,
    isNumeric = param => false,
    intVal = param => false,
    floatVal = param => false,
    isBool = param => false,
    isArray = param => false,
    isNull = param => false,
    isObject = param => false,
    isCallable = param => false,
    isFunction = param => false,
    isScalar = param => false,
    isEmpty = param => false,
    isUnsigned = param => false,
    global = unsafeWindow;



/**
 * Creates an Element
 *
 * @param {string} tagName
 * @param {Object} [attributes]
 * @param {string} [innerHTML]
 * @returns {HTMLElement}
 */
function createElement(tagName = 'div', attributes = null, innerHTML = '') {
    return new HTMLElement();
}

/**
 * Generate a unique ID
 * @returns {string}
 */
function uniqid() {
    return '';
}

/**
 * Clones an Object
 * @param {Object} obj 
 * @returns {Object|undefined}
 */
function clone(obj) {
    return {};
}



const utils = {
    isPlainObject, isUndef, isUnsigned,
    isString, isNumber, isNumeric, isBool, isScalar,
    isInt, isFloat, intVal, floatVal, isNaN, isEmpty,
    isArray, isNull, isObject, isCallable, isFunction,
    createElement, uniqid, JSON: window.JSON, global, document, clone
}, root = { utils };








