const nodefinder = {};
root.finder = finder;



/**
 * Create a new search request
 *
 * @param {EventTarget} root
 * @param {string} selector
 * @param {function} callback
 * @returns
 */
function finderRequest(root, selector, callback){

    if (!(this instanceof finderRequest)) {
        return new finderRequest(root, selector, callback);
    }


    if (typeof root === 'string') {
        callback = selector;
        selector = root;
        root = document;
    }

    if (!isValidSelector(selector)) {
        throw new Error('Invalid selector');
    }
    if (typeof callback !== "function") {
        throw new Error('Invalid callback');
    }
    this.root = root;
    this.selector = selector;
    this.callback = callback;
    this.nodes = [];
}

finderRequest.prototype = {
    forEach(callback){
        if (typeof callback !== "function") {
            throw new Error('Invalid callback');
        }
        let i;

        for (i = 0; i < this.nodes.length; i++) {
            callback(this.nodes[i], i);
        }
        return this;

    },
    push(node){
        if (node instanceof Element && !this.has(node) && this.root.contains(node) && node.matches(this.selector)) {
            this.nodes.push(node);
            return true;
        }
        return false;
    },

    has(node){
        return this.nodes.includes(node);
    }


};




/**
 * Searches for uniques nodes as they are created
 *
 * @param {EventTarget|finderRequest} [root]
 */
function finder(root){

    if (!(this instanceof finder)) {
        return new finder(root);
    }



}

finder.prototype = {
    abort: function(){
        return this;
    },

    find: function(selector, callback){
        return this;
    },
    findOne: function(selector, callback){

        if (!callback) {
            return new Promise();
        }

        return this;
    }
}


finder.find = function(root, selector, callback){

    return new finder();
};

finder.findOne = function(root, selector, callback){

    return new finder();
};


nodefinder.finder = finder;
nodefinder.finderRequest = finderRequest;