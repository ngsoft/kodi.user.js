/** jsonrpc.js */
(function (root, factory) {
    /* globals define, require, module, self, exports, AbortController */
    let name = 'jsonrpc', deps = ['gmfetch', 'utils'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        factory(root[name] = {}, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function (exports, gmfetch, utils, undef) {

    const { JSON, isPlainObject, isString, isArray, isInt, isNull, isUnsigned, clone } = utils;


    const
        jsonrpc = '2.0',

        ErrorCodes = {
            ParseError: -32700,
            InvalidRequest: -32600,
            MethodNotFound: -32601,
            InvalidParams: -32602,
            InternalError: -32603

        },
        ErrorMessages = {
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





    class Request {

        get jsonrpc() {
            return this.data.jsonrpc;
        }

        get method() {
            return this.data.method;
        }

        get params() {
            return this.data.params;
        }

        get id() {
            return this.params.id;
        }


        withMethod(method) {
            return new Request(method, this.params, this.id);
        }

        withParams(params) {
            return new Request(this.method, params, this.id);
        }

        withId(id) {
            return new Request(this.method, this.params, id);
        }

        constructor(method, params, id) {


            if (!isString(method)) {
                throw new TypeError('Invalid method');
            }

            if (isInt(params)) {
                id = params;
                params = {};
            }

            if (params === undef || isNull(params)) params = {};

            if (!isPlainObject(params) && !isArray(params)) {
                throw new TypeError('Invalid params');
            }

            if (id === undef) id = 1;
            else if (isNull(id)) id = 0;

            if (!isInt(id) || !isUnsigned(id)) {
                throw new TypeError('Invalid id');
            }

            this.data = {
                jsonrpc: jsonrpc,
                method: method,
                params: params
            };
            if (id > 0) {
                this.data.id = id;
            }
        }

        toString() {
            return JSON.stringify(this.data);
        }
    }



    class ResponseError extends Error {

        constructor(obj) {

            let message = '', code = 0, formattedMessage = '';

            obj = isPlainObject(obj) ? obj : ErrorMessages.ParseError;

            if (isPlainObject(obj)) {
                message = obj.message || message;
                code = obj.code || code;
            }
            formattedMessage = `${message} (code: ${code})`;
            super(formattedMessage);

        }

    }



    class Response {


        get jsonrpc() {
            return jsonrpc;
        }

        get result() {
            return this.data.result;
        }

        get id() {
            return this.data.id;
        }

        get error() {
            return this.data.error;
        }



        constructor(resp) {

            let obj, parseError = new ResponseError(ErrorMessages.parseError);

            if (!isPlainObject(resp)) {
                if (!isString(resp)) {
                    throw parseError;
                }

                try {
                    resp = JSON.parse(resp);
                } catch (err) {
                    throw parseError;
                }
            }

            if (!isPlainObject(resp) || !resp.jsonrpc || resp.jsonrpc !== jsonrpc) {
                throw parseError;
            }

            this.data = {
                jsonrpc: resp.jsonrpc,
                id: resp.id || null
            };

            if (resp.error) {
                this.data.error = new ResponseError(resp.error);
            } else if (resp.result === undef) this.data.error = parseError;
            else this.data.result = resp.result;
        }

        toString() {
            return JSON.stringify(this.data);
        }
    }


    class Client {

        send(method, params, id, timeout) {

            return new Promise((rsl, rej) => {
                let reqst, headers = clone(this.headers);

                if (method instanceof Request) {
                    reqst = method;
                } else reqst = new Request(method, params, id);

                timeout = (isInt(timeout) && isUnsigned(timeout)) ? timeout : 8000;

                let
                    controller = new AbortController(),
                    tid = setTimeout(() => {
                        controller.abort();
                    }, timeout),
                    options = {
                        method: 'POST',
                        headers: headers,
                        body: reqst.toString(),
                        signal: controller.signal
                    };

                gmfetch
                    .fetch(this.server, options)
                    .then(resp => {
                        clearTimeout(tid);
                        return resp.json();
                    })
                    .then(obj => {
                        let resp = new Response(obj);
                        if (resp.error) {
                            console.error(reqst, resp);
                            return rej(resp.error);
                        }

                        rsl(resp);
                    }).catch(err => rej(err));

            });

        }


        constructor(url, headers) {

            if (url instanceof URL) url = url.href;
            if (!isString(url) || !/^https?:\/\//.test(url)) {
                throw new Error('Invalid URL');
            }

            this.server = new URL(url);
            headers = isPlainObject(headers) ? headers : {};
            this.headers = Object.assign({
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json, text/plain, */*'
            }, headers);

        }
    }

    Object.assign(exports, { Response, Request, Client, ResponseError, ErrorCodes });

}));