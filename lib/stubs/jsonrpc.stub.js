const jsonrpc = {};

/**
 *
 * @param {string|URL} url
 * @param {Object} [headers]
 * @returns {JsonRPCRequest}
 */
function JsonRPCRequest(url, headers){
    return this;
}

JsonRPCRequest.prototype = {
    /**
     * Send a jsonRPC Request
     *
     * @param {string} method
     * @param {Object|Array} [params]
     * @param {int} [id]
     * @returns {Promise}
     */
    send(method, params, id = 1){
        return new Promise();
    }
};


root.jsonrpc = jsonrpc;