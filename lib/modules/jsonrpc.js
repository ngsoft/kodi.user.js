/** jsonrpc.js */
(function(root, factory){
    /* globals define, require, module, self, exports */
    let name = 'jsonrpc', deps = ['gmfetch'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        factory(root[name] = {}, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function(exports, gmfetch){



    const global = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const {JSON} = global;



    /**
     * Test if given argument is a plain object
     * @param {any} v
     * @returns {Boolean}
     */
    function isPlainObject(v){
        return v instanceof Object && Object.getPrototypeOf(v) === Object.prototype;
    }



    class JsonRPC {

        request(method, params, id = 1){
            return gmfetch
                    .fetch(this.server, {
                        method: 'POST',
                        body: JSON.stringify({
                            jsonrpc: this.jsonrpc,
                            method: method,
                            params: params || {},
                            id: id
                        }),
                        headers: Object.assign({
                            'Content-Type': 'application/json; charset=utf-8',
                            'Accept': 'application/json, text/plain, */*'
                        }, this.headers)
                    })
                    .then(resp => resp.json())
                    .then(obj => {
                        if (obj.error) {
                            console.error(obj.error);
                            throw new Error(obj.error.message);
                        }
                        return obj;
                    });
        }


        constructor(url, headers){

            if (url instanceof URL) url = url.href;
            if (typeof url !== 'string' || !/^https?:\/\//.test(url)) {
                throw new Error('Invalid URL');
            }

            this.server = url;
            this.jsonrpc = '2.0';
            this.headers = isPlainObject(headers) ? headers : {};
        }
    }

    exports.JsonRPC = JsonRPC;

    exports.send = function(url, method, params){
        let svr = new JsonRPC(url);
        return svr.request(method, params);
    };




}));