



/**
 * Searches for uniques nodes as they are created
 *
 * @param {EventTarget} [root]
 */
function finder(root) {

    if (!(this instanceof finder)) {
        return new finder(root);
    }

}

finder.prototype = {
    /**
     * 
     * @returns {finder}
     */
    abort: function () {
        return this;
    },
    /**
     * Find multiples nodes when they are added
     * @param {string} selector 
     * @param {function} callback 
     * @returns {finder}
     */
    find: function (selector, callback) {
        return this;
    },
    /**
     * Find one
     * @param {string} selector 
     * @param {function} [callback]
     * @returns {finder|Promise}
     */
    findOne: function (selector, callback) {

        if (!callback) {
            return new Promise();
        }

        return this;
    }
};

/**
 * Find multiples nodes when they are added to the root
 * @param {EventTarget} [root]
 * @param {string} selector 
 * @param {function} callback 
 * @returns {finder}
 */
finder.find = function (root, selector, callback) {

    return new finder();
};
/**
 * Find one
 * @param {EventTarget} [root]
 * @param {string} selector 
 * @param {function} [callback]
 * @returns {finder|Promise}
 */
finder.findOne = function (root, selector, callback) {

    return new finder();
};



root.finder = finder;
