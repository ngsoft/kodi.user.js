/**
 * Based on https://github.com/trim21/gm-fetch and https://github.com/mitchellmebane/GM_fetch
 * using last version of https://github.com/github/fetch
 * and using browser builtin Headers, Request, Response
 * as of today(3.6.2) and modified to run in sandbox with tampermonkey beta
 * tamper-fetch.js
 */
(function(root, factory){
    /* globals define, require, module, self, exports, unsafeWindow */
    let name = 'tamper-fetch', deps = [];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        factory(root[name] = {}, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function(exports, dep){


    const
            global = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window,
            root = typeof self !== 'undefined' ? self : this,
            support = {
                blob:
                        'FileReader' in global &&
                        'Blob' in global &&
                        (function(){
                            try {
                                new Blob();
                                return true;
                            } catch (e) {
                                return false;
                            }
                        })(),
                formData: 'FormData' in global,
                arrayBuffer: 'ArrayBuffer' in global,
                GM_xmlhttpRequest: 'GM_xmlhttpRequest' in root
            };






    function normalizeValue(value){
        if (typeof value !== 'string') {
            value = String(value);
        }
        return value;
    }

    function parseHeaders(rawHeaders){
        let headers = new Headers(),
                preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
        preProcessedHeaders
                .split("\r")
                .map(function(header){
                    return header.indexOf("\n") === 0
                            ? header.substr(1, header.length)
                            : header;
                })
                .forEach(function(line){
                    let parts = line.split(":"),
                            key = parts.shift().trim();
                    if (key) {
                        let value = parts.join(":").trim();
                        value.split("\n").forEach((val) => {
                            try {
                                headers.append(key, val);
                            } catch (e) {
                            }
                        });
                    }
                });

        return headers;
    }


    function responseURL(finalUrl, rawRespHeaders, respHeaders){

        if (finalUrl) {
            return finalUrl;
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/m.test(rawRespHeaders)) {
            return respHeaders.get('X-Request-URL');
        }

    }



    function createResponse(xhr_response){

        let
                rawResponseHeaders = xhr_response.responseHeaders || '',
                parsedResponseHeaders = parseHeaders(rawResponseHeaders),
                url = responseURL(xhr_response.finalUrl, rawResponseHeaders, parsedResponseHeaders),
                options = {
                    status: xhr_response.status,
                    statusText: xhr_response.statusText,
                    headers: parsedResponseHeaders

                },
                body = 'response' in xhr_response ? xhr_response.response : xhr_response.responseText,
                resp = new Response(body, options);

        if (typeof url === 'string') {
            Object.defineProperty(resp, 'url', {
                enumerable: true, configurable: true,
                get(){
                    return url;
                }
            });


        }

        return resp;
    }





    exports.DOMException = global.DOMException;


    try {
        new exports.DOMException();
    } catch (err) {
        exports.DOMException = function(message, name){
            this.message = message;
            this.name = name;
            const error = Error(message);
            this.stack = error.stack;
        };
        exports.DOMException.prototype = Object.create(Error.prototype);
        exports.DOMException.prototype.constructor = exports.DOMException;
    }


    function fetch(input, init){
        return new Promise(function(resolve, reject){
            if (!support.GM_xmlhttpRequest) {
                throw new Error('GM_xmlhttpRequest not implemented, please set @grant GM_xmlhttpRequest');
            }

            const request = new Request(input, init);

            if (request.signal && request.signal.aborted) {
                return reject(new exports.DOMException('Aborted', 'AbortError'));
            }

            function fixUrl(url){
                try {
                    return url === '' && global.location.href ? global.location.href : url;
                } catch (e) {
                    return url;
                }
            }

            const xhr_details = {};


            function abortXhr(){
                aborter.abort();
            }

            xhr_details.onload = function(xhr){

                setTimeout(function(){
                    resolve(createResponse(xhr));
                }, 0);
            };

            xhr_details.onerror = function(){
                setTimeout(function(){
                    reject(new TypeError('Network request failed'));
                }, 0);
            };

            xhr_details.ontimeout = function(){
                setTimeout(function(){
                    reject(new TypeError('Network request failed'));
                }, 0);
            };

            xhr_details.onabort = function(){
                setTimeout(function(){
                    reject(new exports.DOMException('Aborted', 'AbortError'));
                }, 0);
            };


            xhr_details.method = request.method;
            xhr_details.url = fixUrl(request.url);


            if (request.credentials === 'include') {
                xhr_details.anonymous = false;
            } else if (request.credentials === 'omit') {
                xhr_details.anonymous = true;
            }


            if (support.blob) {
                xhr_details.responseType = 'blob';
            } else if (
                    support.arrayBuffer &&
                    request.headers.get('Content-Type') &&
                    request.headers.get('Content-Type').indexOf('application/octet-stream') !== -1
                    ) {
                xhr_details.responseType = 'arraybuffer';
            }


            xhr_details.headers = xhr_details.headers || {};
            if (init && typeof init.headers === 'object' && !(init.headers instanceof Headers)) {

                Object.getOwnPropertyNames(init.headers).forEach(function(name){
                    xhr_details.headers[name] = normalizeValue(init.headers[name]);
                });
            } else {
                request.headers.forEach(function(value, name){
                    xhr_details.headers[name] = value;
                });
            }

            if (typeof request._bodyInit !== 'undefined') {
                xhr_details.data = request._bodyInit;
            }
            if (request.signal) {
                request.signal.addEventListener('abort', abortXhr);

                xhr_details.onreadystatechange = function(xhr){
                    // DONE (success or failure)
                    if (xhr.readyState === 4) {
                        request.signal.removeEventListener('abort', abortXhr);
                    }
                };
            }

            const aborter = root.GM_xmlhttpRequest(xhr_details);

        });
    }

    fetch.polyfill = true;

    exports.fetch = fetch;


    function fetch_timeout(input, init, timeout = 60){

        let promise, id;

        const controller = new AbortController();
        init ??= {};


        if (init.signal instanceof AbortSignal)
        {

            init.signal.addEventListener('abort', () => controller.abort());
        }

        init.signal = controller.signal;

        if (typeof init.timeout === 'number')
        {
            timeout = init.timeout;
        }
        delete init.timeout;

        if (timeout < 100)
        {
            timeout *= 1000;
        }

        promise = fetch(input, init);
        id = setTimeout(() => {
            controller.abort();
        }, timeout);

        return promise.finally(() => clearTimeout(id));

    }

    exports.fetch_timeout = fetch_timeout;


    Object.defineProperty(exports, '__esModule', {value: true});
}));

