

/**
 *
 * @param {string|URL|Request} resource
 * @param {Object} [init]
 * @returns {Promise}
 */
function fetch(resource, init) {
    return new Promise();
}


function iterator(items) {
    this.items = items;

}

iterator.prototype.next = function () {
    var value = this.items.shift();
    return { done: value === undefined, value: value };
};


/**
 * Creates a new Headers object.
 * @param {Object} init
 * @returns {Headers}
 */
function Headers(init) { }
/**
 * Appends a new value onto an existing header inside a Headers object, or adds the header if it does not already exist.
 * @param {string} name
 * @param {string} value
 * @returns {undefined}
 */
Headers.prototype.append = function (name, value) { };
/**
 * Deletes a header from a Headers object.
 *
 * @param {string} name
 * @returns {undefined}
 */
Headers.prototype['delete'] = function (name) { };


/**
 * Returns a String sequence of all the values of a header within a Headers object with a given name.
 * @param {string} name
 * @returns {string|null}
 */
Headers.prototype.get = function (name) { };

/**
 * Returns a boolean stating whether a Headers object contains a certain header.
 *
 * @param {string} name
 * @returns {Boolean}
 */
Headers.prototype.has = function (name) { };

/**
 * The set() method of the Headers interface sets a new value for an existing header inside a Headers object, or adds the header if it does not already exist.
 * @param {string} name
 * @param {string} value
 * @returns {undefined}
 */
Headers.prototype.set = function (name, value) { };

/**
 * Executes a provided function once for each array element.
 *
 * @param {function} callback
 * @param {Object} thisArg
 * @returns {undefined}
 */
Headers.prototype.forEach = function (callback, thisArg) { };

/**
 * The Headers.keys() method returns an iterator allowing to go through all keys contained in this object. The keys are String objects.
 *
 * @returns {iterator}
 */
Headers.prototype.keys = function () {
    return new iterator();
};
/**
 * The Headers.values() method returns an iterator allowing to go through all values contained in this object. The values are String objects.
 * @returns {iterator}
 */
Headers.prototype.values = function () {
    return new iterator();
};
/**
 * The Headers.entries() method returns an iterator allowing to go through all key/value pairs contained in this object. The both the key and value of each pairs are String objects
 * @returns {iterator}
 */
Headers.prototype.entries = function () {
    return new iterator();
};

/**
 * Creates a new Request object.
 * @param {string|Request} input
 * @param {Object} [options]
 * @returns {Request}
 */
function Request(input, options) { }

Request.prototype = {
    /**
     * The clone() method of the Request interface creates a copy of the current Request object.
     * @returns {Request}
     */
    clone: function () {
        return new Request();
    },
    bodyUsed: false,
    credentials: 'same-origin',
    redirect: 'follow',
    referrer: new URL(),
    cache: 'no-store',
    mode: 'cors',
    body: '',
    method: 'GET',
    headers: new Headers()
};



function Response(bodyInit, options) {
    if (!(this instanceof Response)) {
        throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
    }
    if (!options) {
        options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = options.statusText === undefined ? '' : '' + options.statusText;
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
}


Response.prototype = {
    type: 'default',
    status: 200,
    ok: true,
    statusText: '',
    headers: new Headers(),
    url: '',
    body: '',
    bodyUsed: false,
    redirected: false,
    arrayBuffer: function () {
        return new Promise();
    },
    blob: function () {
        return new Promise();
    },
    text: function () {
        return new Promise();
    },
    json: function () {
        return new Promise();
    },
    formData: function () {
        return new Promise();
    },
    clone: function () {
        return new Response();
    },
    error: function () {
        return new Response();
    },
    redirect: function (url, status) {
        return new Response();
    }


};

Response.error = function () {
    return new Response();

};

Response.redirect = function (url, status) {
    return new Response();
};


const
    gmfetch = {
        fetch, Request, Response, Headers
    },
    root = { gmfetch };
