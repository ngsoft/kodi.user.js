/** nodefinder.js */
(function (root, factory) {
    /* globals define, require, module, self, exports, unsafeWindow, EventTarget */
    let name = 'finder', deps = ['gmtools'];
    if (typeof define === 'function' && define.amd) {
        define(name, deps, factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        module.exports = factory(...deps.map(d => require(d)));
    } else {
        root[name] = factory(...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function(gmtools, undef){


    const global = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const {document} = global;
    const {runAt} = gmtools;


    /**
     * Tests whenever the given selector is valid
     * @param {string} selector
     * @returns {Boolean}
     */
    function isValidSelector(selector) {
        if (typeof selector !== 'string') return false;
        let valid = true;
        try {
            //throws syntax error on invalid selector
            valid = document.createElement('template').querySelector(selector) === null;
        } catch (e) {
            valid = false;
        }
        return valid;
    }


    /**
     * Create a new search request
     * 
     * @param {EventTarget} root 
     * @param {string} selector 
     * @param {function} callback 
     * @returns 
     */
    function finderRequest(root, selector, callback) {

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
        forEach(callback) {
            if (typeof callback !== "function") {
                throw new Error('Invalid callback');
            }
            let i;

            for (i = 0; i < this.nodes.length; i++) {
                callback(this.nodes[i], i);
            }
            return this;

        },
        push(node) {
            if (node instanceof Element && !this.has(node) && this.root.contains(node) && node.matches(this.selector)) {
                this.nodes.push(node);
                return true;
            }
            return false;
        },

        has(node) {
            return this.nodes.includes(node);
        }


    };




    /**
     * Searches for uniques nodes as they are created
     * 
     * @param {EventTarget|finderRequest} [root] 
     */
    function finder(root) {

        if (!(this instanceof finder)) {
            return new finder(root);
        }

        let
            started = false,
            options = {
                attributes: true,
                childList: true,
                subtree: true
            },
            t = this, observer, request;


        if (root instanceof finderRequest) {
            request = root;
            root = request.root;
        }

        root = root instanceof EventTarget ? root : document.documentElement;

        observer = new MutationObserver(mut => {
            let node, newNodes = [],
                computeNode = node => {
                    if (!request || request.has(node) || newNodes.includes(node) || !started) return;
                    if (node instanceof Element && node.matches(request.selector)) newNodes.push(node);
                };
            //checks mutations
            mut.forEach(m => {
                node = m.target;
                computeNode(node);
                if (m.type === 'childList') {
                    [m.addedNodes, m.removedNodes].forEach(items => {
                        items.forEach(computeNode);
                    });
                }
            });
            // checks if new nodes have been added
            request.root.querySelectorAll(request.selector).forEach(computeNode);

            if (newNodes.length > 0) {
                while ((node = newNodes.shift())) {
                    if (request.push(node)) {
                        request.callback(node, t, request);
                    }
                    // abort()
                    if (!started) return;
                }
            }

        });


        function start() {
            if (started || !request) return t;
            started = true;
            runAt.documentIdle().then(() => {
                request.root.querySelectorAll(request.selector).forEach(node => {
                    // abort()
                    if (!started) return;
                    if (request.push(node)) {
                        request.callback(node, t, request);
                    }
                });
                // abort(), findOne fast ...
                if (started) observer.observe(request.root, options);
            });

            return t;

        }


        function abort() {
            if (started) {
                started = false;
                observer.disconnect();
            }
            return t;
        }


        function find(selector, callback) {
            if (selector instanceof finderRequest) {
                request = selector;
            } else request = new finderRequest(root, selector, callback);
            return start();
        }

        function findOne(selector, callback) {

            if (typeof callback !== "function" && isValidSelector(selector)) {
                return new Promise(rsl => {
                    findOne(selector, node => {
                        rsl(node);
                    });
                });

            }

            let request;

            if (selector instanceof finderRequest) {
                request = selector;
            } else request = new finderRequest(root, selector, callback);

            return find(selector, node => {
                if (request.push(node)) {
                    request.callback(node, t, request);
                    abort();
                }
            });
        }



        this.find = find;
        this.findOne = findOne;
        this.abort = abort;

        if (request instanceof finderRequest) start();

    }


    finder.find = function (root, selector, callback) {

        if (!(root instanceof EventTarget)) {
            callback = selector;
            selector = root;
            root = document.documentElement;
        }

        let query = finder(root);
        return query.find(selector, callback);
    };

    finder.findOne = function (root, selector, callback) {

        if (!(root instanceof EventTarget)) {
            callback = selector;
            selector = root;
            root = document.documentElement;
        }

        let query = finder(root);
        return query.findOne(selector, callback);
    };




    finder.finderRequest = finderRequest;
    return finder;

}));
