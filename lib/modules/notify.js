/** notify.js */
(function(root, factory){
    /* globals define, require, module, self, exports */
    let name = 'notify', deps = ['gmtools', 'gmfetch'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        factory(root[name] = {}, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function(exports, gmtools, gmfetch){


    const
            global = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window,
            root = typeof self !== "undefined" ? self : this;
    const {document} = global;

    const
            repo = 'https://cdn.jsdelivr.net/npm/izitoast/dist',
            js = '/js/iziToast.js',
            css = '/css/iziToast.css',
            name = 'iziToast',
            opts = {
                zindex: 2147483647,
                image: gmtools.metadata.icon || null,
                imageWidth: 48,
                layout: 2,
                closeOnClick: true,
                closeOnEscape: true
            },
            styles = `.iziToast-wrapper-bottomRight{top: 40% !important;bottom: auto !important;}`;


    let iziToast = root[name];



    function loadCSS(){

        return new Promise(rsl => {

            if (loadCSS.loaded) {
                rsl();
                return;
            }
            if (!loadCSS.loading) {
                loadCSS.loading = true;
                let addr = gmtools.getResource(name), head = document.getElementsByTagName('head')[0];
                if (!addr) addr = repo + css;
                head.appendChild(Object.assign(document.createElement('link'), {
                    rel: "stylesheet",
                    type: "text/css",
                    href: addr,
                    onload: function(){
                        gmtools.addStyle(styles);
                        loadCSS.loaded = true;
                    }
                }));
            }
            let worker = () => {

                if (!loadCSS.loaded) {
                    setTimeout(() => {
                        worker();
                    }, 20);
                } else rsl();
            };
            worker();
        });
    }

    function loadJS(){

        return new Promise(rsl => {

            if (loadJS.loaded) {
                rsl(iziToast);
                return;
            }

            if (!loadJS.loading) {
                loadJS.loading = true;
                gmfetch.fetch(repo + js)
                        .then(resp => resp.text())
                        .then(code => {
                            // execute code in the right context (self: not window)
                            gmtools.execute(code).then(() => {
                                iziToast = root[name];
                                loadJS.loaded = true;
                            });
                        });
            }

            let worker = () => {

                if (!loadJS.loaded) {
                    setTimeout(() => {
                        worker();
                    }, 20);
                } else rsl(iziToast);
            };
            worker();

        });



    }


    loadJS.loaded = typeof iziToast !== "undefined";


    function getIziToast(){
        return new Promise(rsl => {
            loadCSS().then(() => {
                loadJS().then(rsl);
            });

        });
    }

    exports.getIziToast = getIziToast;

    function toast(message, title, method = 'info'){
        return new Promise(rsl => {

            getIziToast().then(izi => {

                if (typeof izi[method] !== 'function') throw new Error('Invalid method ' + method);
                title = title || exports.title;
                izi[method](Object.assign({
                    message: message,
                    title: title,
                    onClosed: function(){
                        rsl(exports);
                    }
                }, opts));

            });

        });
    }


    exports.toast = toast;

    exports.title = '';


    exports.success = function(message, title = ''){
        return toast(message, title, 'success');
    };

    exports.error = function(message, title = ''){
        return toast(message, title, 'error');
    };

    exports.notice = exports.message = function(message, title = ''){
        return toast(message, title);
    };

    exports.warn = function(message, title = ''){
        return toast(message, title, 'warning');
    };


}));
