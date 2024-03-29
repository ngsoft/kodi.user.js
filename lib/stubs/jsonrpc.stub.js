
const ErrorCodes = {
    ParseError: -32700,
    InvalidRequest: -32600,
    MethodNotFound: -32601,
    InvalidParams: -32602,
    InternalError: -32603

}, ErrorMessages = {
    ParseError: {
        message: 'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.',
        code: ErrorCodes.ParseError
    },
    InvalidRequest: {
        message: 'The JSON sent is not a valid Request object.',
        code: ErrorCodes.InvalidRequest
    },
    MethodNotFound: {
        message: 'The method does not exist / is not available.',
        code: ErrorCodes.MethodNotFound
    },
    InvalidParams: {
        message: 'Invalid method parameter(s)',
        code: ErrorCodes.InvalidParams
    },
    InternalError: {
        message: 'Internal JSON-RPC error.',
        code: ErrorCodes.InternalError
    }
};

class ResponseError extends Error { }

/**
 * Create a new request
 * 
 * @param {string} method 
 * @param {Object|Array} [params]
 * @param {Number|null} [id]
 * @returns {Request}
 */
function Request(method, params, id) { }

Request.prototype = {
    jsonrpc: '',
    method: '',
    params: {},
    id: 1,
    /**
     * Creates new instance with specified method
     * @param {string} method 
     * @returns {Request}
     */
    withMethod: function (method) { return this; },
    /**
     * Creates new instance with specified params
     * @param {Object|Array} params 
     * @returns 
     */
    withParams: function (params) { return this; },
    /**
     * Creates new instance with specified id
     * @param {number} id 
     * @returns {Request}
     */
    withId: function (id) { return this; },
    /**
     * Returns Request JSON
     * @returns {string}
     */
    toString: function () { return ''; }
};

/**
 * Creates a new Response
 * @param {string|Object} resp 
 * @returns {Response}
 */
function Response(resp) { return this; }


Response.prototype = {
    jsonrpc: '',
    result: {},
    id: 1,
    error: new ResponseError()
};
/**
 * Connect to a server
 * @param {string|URL} url 
 * @param {Object} [headers]
 * @returns {Client}
 */
function Client(url, headers) {
    return this;
}


Client.prototype = {
    /**
     * Send a jsonRPC Request
     * @param {string|Request} method 
     * @param {Object|Array} [params]
     * @param {number|null} [id]
     * @param {number} [timeout]
     * @returns {Promise<Response>}
     */
    send: function (method, params, id, timeout) { return new Promise(); }
};


const
    jsonrpc = { ErrorCodes, Request, Response, ResponseError, ErrorMessages },
    root = { jsonrpc };
