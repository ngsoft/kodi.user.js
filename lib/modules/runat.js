/** runat.js */
(function (root, factory) {
    /* globals define, require, module, self, exports */
    let name = 'runat', deps = [];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        factory(root[name] = {}, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function (exports) {


    let
        global = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window,
        document = global.document;

    // run-at

    Object.assign(exports, {

        documentStart: function () {
            // do nothing
            return new Promise(rsl => {
                rsl(document);
            });

        },
        documentBody: function () {

            return new Promise(rsl => {

                let fn = (mut, obs) => {
                    let body;
                    mut.forEach(m => {
                        m.addedNodes.forEach(node => {
                            if (typeof node.matches === 'function' && node.matches('body')) {
                                obs.disconnect();
                                body = node;
                            }
                        });
                    });
                    if (body) rsl(body);

                };

                if (document.body === null) {
                    const observer = new MutationObserver(fn);
                    observer.observe(document.documentElement, { childList: true });
                } else rsl(document.body);

            });

        },
        documentEnd: function () {

            return new Promise(rsl => {
                // some browsers, sites locks the events
                function worker() {
                    if (document.readyState === 'complete') {
                        rsl(document);
                        return;
                    }
                    setTimeout(() => {
                        worker();
                    }, 20);
                }
                worker();
            });



        },

        documentIdle: function () {
            return new Promise(rsl => {
                // some browsers, sites locks the events
                function worker() {
                    if (document.readyState !== 'loading') {
                        rsl(document);
                        return;
                    }
                    setTimeout(() => {
                        worker();
                    }, 20);
                }
                worker();
            });
        }
    });



}));