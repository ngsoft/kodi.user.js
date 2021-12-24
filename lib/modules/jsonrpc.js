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

}(typeof self !== 'undefined' ? self : this, function (exports, gmfetch, utils) {

    const { JSON, isPlainObject, isString, isArray } = utils;


    class JsonRPCRequest {

        send(method, params = null, id = 1, timeout = 8000) {


            let
                request = {
                    jsonrpc: this.jsonrpc,
                    method: method,
                    id: id
                },
                headers = Object.assign({
                    'Content-Type': 'application/json; charset=utf-8',
                    'Accept': 'application/json, text/plain, */*'
                }, this.headers);

            if (isPlainObject(params) || isArray(params)) {
                request.params = params;
            } else request.params = {};

            let
                controller = new AbortController(),
                tid = setTimeout(() => {
                    controller.abort();
                }, timeout);

            return gmfetch
                .fetch(this.server, {
                    method: 'POST',
                    body: JSON.stringify(request),
                    headers: headers,
                    signal: controller.signal
                })
                .then(resp => {
                    clearTimeout(tid);
                    return resp.json();
                })
                .then(obj => {
                    if (obj.error) {
                        console.error(method, request, obj);
                        throw new Error(obj.error.message);
                    }
                    return obj;
                });
        }


        constructor(url, headers) {

            if (url instanceof URL) url = url.href;
            if (!isString(url) || !/^https?:\/\//.test(url)) {
                throw new Error('Invalid URL');
            }

            this.server = new URL(url);
            this.jsonrpc = '2.0';
            this.headers = isPlainObject(headers) ? headers : {};
        }
    }



    exports.JsonRPCRequest = JsonRPCRequest;


}));