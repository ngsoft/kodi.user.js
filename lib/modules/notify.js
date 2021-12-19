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
            styles = `.iziToast-wrapper-bottomRight{top: 40% !important;bottom: auto !important;}`,
            cssID = 'iziToastCSS';


    let iziToast = root[name];


    function executeWorker(callback, interval = 20){

        return new Promise(rsl => {
            if (typeof callback !== 'function') {
                throw new Error('Invalid callback');
            }
            
            let handler = function(){
                if (true !== callback()) {
                    setTimeout(function(){
                        handler();
                    }, interval);
                } else rsl();
            };

            handler();
        });
    }



    function loadCSS(){

        return new Promise(rsl => {

            if (loadCSS.loaded) {
                rsl();
                return;
            }
            //loaded with another script
            if (document.querySelector('link[data-loaded]#' + cssID) !== null) {
                loadCSS.loaded = loadCSS.loading = true;
            }
            if (!loadCSS.loading) {
                loadCSS.loading = true;
                let addr = gmtools.getResource(name), head = document.getElementsByTagName('head')[0];
                if (!addr) addr = repo + css;
                let elem = Object.assign(document.createElement('link'), {
                    rel: "stylesheet",
                    type: "text/css",
                    id: cssID,
                    href: addr,
                    onload: function(){
                        gmtools.addStyle(styles);
                        loadCSS.loaded = true;
                        elem.dataset.loaded = "true";
                    }
                });
                head.appendChild(elem);
            }
            executeWorker(() => loadCSS.loaded === true).then(() => rsl());

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

            executeWorker(() => loadJS.loaded === true).then(() => rsl(iziToast));
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
