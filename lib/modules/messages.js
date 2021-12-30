/** messages.js */
(function (root, factory) {
    /* globals define, require, module, self, exports */
    let name = 'messages', deps = ['utils', 'gmfetch', 'execute', 'emitter'];
    if (typeof define === 'function' && define.amd) {
        define(name, deps, factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        module.exports = factory(...deps.map(d => require(d)));
    } else {
        root[name] = factory(...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function (utils, gmfetch, GM_execute, emitter, undef) {

    const library = 'https://cdn.jsdelivr.net/gh/dollarshaveclub/postmate@master/build/postmate.dev.js';
    const { global, uniqid, JSON, isString, isFunction } = utils;
    const root = typeof self !== "undefined" ? self : this;

    let Postmate = root.Postmate, loading = false;



    function executeWorker(callback, interval = 20) {

        return new Promise(rsl => {
            if (!isFunction(callback)) {
                throw new Error('Invalid callback');
            }

            let handler = function () {
                if (true !== callback()) {
                    setTimeout(function () {
                        handler();
                    }, interval);
                } else rsl();
            };

            handler();
        });
    }



    function getPostmate() {
        return new Promise((rsl, rej) => {
            if (Postmate) {
                rsl(Postmate);
                return;
            } else if (!loading) {
                console.warn('You can optimize your userscript using', '@require ' + library);
                loading = true;
                gmfetch.fetch(library)
                    .then(resp => {
                        if (resp.status === 200) {
                            return resp.text();
                        } else throw new Error('Cannot fetch ' + library);
                    })
                    .then(code => {
                        GM_execute(code).then(() => {
                            Postmate = root.Postmate;
                        });
                    })
                    .catch(err => rej(err));
            }
            executeWorker(() => Postmate !== undef)
                    .then(() => rsl(Postmate));
        });
    }











    return {

        getPostmate


    };
}));