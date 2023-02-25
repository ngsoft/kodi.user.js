/** tamper-fetch.js */
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
            JSON = global.JSON,
            support = {
                searchParams: 'URLSearchParams' in global,
                iterable: 'Symbol' in global && 'iterator' in Symbol,
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
                GM_xmlhttpRequest: 'GM_xmlhttpRequest' in global

            };


    function notImplemented(){

        if (!support.GM_xmlhttpRequest) {
            throw new Error('GM_xmlhttpRequest not implemented, please set @grant GM_xmlhttpRequest');
        }
    }
    function isDataView(obj){
        return obj && DataView.prototype.isPrototypeOf(obj);
    }

    if (support.arrayBuffer) {
        var viewClasses = [
            '[object Int8Array]',
            '[object Uint8Array]',
            '[object Uint8ClampedArray]',
            '[object Int16Array]',
            '[object Uint16Array]',
            '[object Int32Array]',
            '[object Uint32Array]',
            '[object Float32Array]',
            '[object Float64Array]'
        ];

        var isArrayBufferView =
                ArrayBuffer.isView ||
                function(obj){
                    return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
                };
    }


    function normalizeValue(value){
        if (typeof value !== 'string') {
            value = String(value);
        }
        return value;
    }


    function consumed(body){
        if (body.bodyUsed) {
            return Promise.reject(new TypeError('Already read'));
        }
        body.bodyUsed = true;
    }

    function fileReaderReady(reader){
        return new Promise(function(resolve, reject){
            reader.onload = function(){
                resolve(reader.result);
            };
            reader.onerror = function(){
                reject(reader.error);
            };
        });
    }

    function readBlobAsArrayBuffer(blob){
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsArrayBuffer(blob);
        return promise;
    }

    function readBlobAsText(blob){
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsText(blob);
        return promise;
    }

    function readArrayBufferAsText(buf){
        var view = new Uint8Array(buf);
        var chars = new Array(view.length);

        for (var i = 0; i < view.length; i++) {
            chars[i] = String.fromCharCode(view[i]);
        }
        return chars.join('');
    }

    function bufferClone(buf){
        if (buf.slice) {
            return buf.slice(0);
        } else {
            var view = new Uint8Array(buf.byteLength);
            view.set(new Uint8Array(buf));
            return view.buffer;
        }
    }

    function Body(){
        this.bodyUsed = false;

        this._initBody = function(body){
            /*
             fetch-mock wraps the Response object in an ES6 Proxy to
             provide useful test harness features such as flush. However, on
             ES5 browsers without fetch or Proxy support pollyfills must be used;
             the proxy-pollyfill is unable to proxy an attribute unless it exists
             on the object before the Proxy is created. This change ensures
             Response.bodyUsed exists on the instance, while maintaining the
             semantic of setting Request.bodyUsed in the constructor before
             _initBody is called.
             */
            this.bodyUsed = this.bodyUsed === true;
            this._bodyInit = body;
            if (!body) {
                this._bodyText = '';
            } else if (typeof body === 'string') {
                this._bodyText = body;
            } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
                this._bodyBlob = body;
            } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
                this._bodyFormData = body;
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                this._bodyText = body.toString();
            } else if (support.arrayBuffer && support.blob && isDataView(body)) {
                this._bodyArrayBuffer = bufferClone(body.buffer);
                // IE 10-11 can't handle a DataView body.
                this._bodyInit = new Blob([this._bodyArrayBuffer]);
            } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
                this._bodyArrayBuffer = bufferClone(body);
            } else {
                this._bodyText = body = Object.prototype.toString.call(body);
            }

            if (!this.headers.get('content-type')) {
                if (typeof body === 'string') {
                    this.headers.set('content-type', 'text/plain;charset=UTF-8');
                } else if (this._bodyBlob && this._bodyBlob.type) {
                    this.headers.set('content-type', this._bodyBlob.type);
                } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                    this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                }
            }
        };

        if (support.blob) {
            this.blob = function(){
                var rejected = consumed(this);
                if (rejected) {
                    return rejected;
                }

                if (this._bodyBlob) {
                    return Promise.resolve(this._bodyBlob);
                } else if (this._bodyArrayBuffer) {
                    return Promise.resolve(new Blob([this._bodyArrayBuffer]));
                } else if (this._bodyFormData) {
                    throw new Error('could not read FormData body as blob');
                } else {
                    return Promise.resolve(new Blob([this._bodyText]));
                }
            };

            this.arrayBuffer = function(){
                if (this._bodyArrayBuffer) {
                    var isConsumed = consumed(this);
                    if (isConsumed) {
                        return isConsumed;
                    }
                    if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
                        return Promise.resolve(
                                this._bodyArrayBuffer.buffer.slice(
                                        this._bodyArrayBuffer.byteOffset,
                                        this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
                                        )
                                );
                    } else {
                        return Promise.resolve(this._bodyArrayBuffer);
                    }
                } else {
                    return this.blob().then(readBlobAsArrayBuffer);
                }
            };
        }

        this.text = function(){
            var rejected = consumed(this);
            if (rejected) {
                return rejected;
            }

            if (this._bodyBlob) {
                return readBlobAsText(this._bodyBlob);
            } else if (this._bodyArrayBuffer) {
                return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
            } else if (this._bodyFormData) {
                throw new Error('could not read FormData body as text');
            } else {
                return Promise.resolve(this._bodyText);
            }
        };

        if (support.formData) {
            this.formData = function(){
                return this.text().then(decode);
            };
        }

        this.json = function(){
            return this.text().then(JSON.parse);
        };

        return this;
    }


    function decode(body){
        var form = new FormData();
        body
                .trim()
                .split('&')
                .forEach(function(bytes){
                    if (bytes) {
                        var split = bytes.split('=');
                        var name = split.shift().replace(/\+/g, ' ');
                        var value = split.join('=').replace(/\+/g, ' ');
                        form.append(decodeURIComponent(name), decodeURIComponent(value));
                    }
                });
        return form;
    }

    function parseHeaders(rawHeaders){
        var headers = new Headers();
        // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
        // https://tools.ietf.org/html/rfc7230#section-3.2
        var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
        // Avoiding split via regex to work around a common IE11 bug with the core-js 3.6.0 regex polyfill
        // https://github.com/github/fetch/issues/748
        // https://github.com/zloirock/core-js/issues/751
        preProcessedHeaders
                .split('\r')
                .map(function(header){
                    return header.indexOf('\n') === 0 ? header.substr(1, header.length) : header;
                })
                .forEach(function(line){
                    var parts = line.split(':');
                    var key = parts.shift().trim();
                    if (key) {
                        var value = parts.join(':').trim();
                        headers.append(key, value);
                    }
                });
        return headers;
    }

    function Response(bodyInit, options){
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

    Body.call(Response.prototype);

    Response.prototype.clone = function(){
        return new Response(this._bodyInit, {
            status: this.status,
            statusText: this.statusText,
            headers: new Headers(this.headers),
            url: this.url
        });
    };

    Response.error = function(){
        var response = new Response(null, {status: 0, statusText: ''});
        response.type = 'error';
        return response;
    };

    var redirectStatuses = [301, 302, 303, 307, 308];

    Response.redirect = function(url, status){
        if (redirectStatuses.indexOf(status) === -1) {
            throw new RangeError('Invalid status code');
        }

        return new Response(null, {status: status, headers: {location: url}});
    };


    exports.DOMException = global.DOMException;
    try {
        new exports.DOMException();
    } catch (err) {
        exports.DOMException = function(message, name){
            this.message = message;
            this.name = name;
            var error = Error(message);
            this.stack = error.stack;
        };
        exports.DOMException.prototype = Object.create(Error.prototype);
        exports.DOMException.prototype.constructor = exports.DOMException;
    }


    function fetch(input, init){
        return new Promise(function(resolve, reject){
            notImplemented();

            var request = new Request(input, init);

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

            var xhr_details = {}, aborter;

            function abortXhr(){
                aborter.abort();
            }

            xhr_details.onload = function(xhr){
                var options = {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: parseHeaders(xhr.responseHeaders || '')
                };
                options.url = 'finalUrl' in xhr ? xhr.finalUrl : options.headers.get('X-Request-URL');
                var body = 'response' in xhr ? xhr.response : xhr.responseText;
                setTimeout(function(){
                    resolve(new Response(body, options));
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

            aborter = global.GM_xmlhttpRequest(xhr_details);

        });
    }

    fetch.polyfill = true;


    Object.defineProperties(exports, {
        __esModule: {value: true},
        fetch: {value: fetch},
        Response: {value: Response}
    });






}));

