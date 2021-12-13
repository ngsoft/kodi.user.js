



/**
 * Searches for uniques nodes as they are created
 *
 * @param {EventTarget|finderRequest} [root]
 */
function finder(root) {

    if (!(this instanceof finder)) {
        return new finder(root);
    }

}

finder.prototype = {
    abort: function () {
        return this;
    },

    find: function (selector, callback) {
        return this;
    },
    findOne: function (selector, callback) {

        if (!callback) {
            return new Promise();
        }

        return this;
    }
};


finder.find = function (root, selector, callback) {

    return new finder();
};

finder.findOne = function (root, selector, callback) {

    return new finder();
};


root.finder = finder;
