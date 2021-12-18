/** notify.js */
(function (root, factory) {
    /* globals define, require, module, self, exports, iziToast, unsafeWindow */
    let name = 'notify', deps = ['gmtools'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        let exports = root[name] = {};
        factory(exports, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function (exports, gmtools) {


    const
        global = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window,
        root = typeof self !== "undefined" ? self : this;
    const { document, btoa } = global;

    const
        repo = 'https://cdn.jsdelivr.net/npm/izitoast/dist',
        js = '/js/iziToast.js',
        css = '/css/iziToast.css',
        name = 'iziToast';

    let loaded = false, loading = false, iziToast = root[name];



    function loadCSS() {
        return new Promise(rsl => {

            if (loaded) {
                rsl();
                return;
            }
            if (!loading) {
                let addr;

                if (gmtools.supports('GM_getResourceURL')) {
                    addr = gmtools.getResourceURL(name);
                } else if (gmtools.supports('GM_getResourceText')) {

                    addr = gmtools.getResourceText(name);
                    if (addr !== null) {
                        addr = 'data:text/css;base64,' + btoa(addr);
                    }
                }
                if (!addr) addr = repo + css;


                document.head.appendChild(Object.assign(document.createElement('link'), {
                    rel: "stylesheet",
                    type: "text/css",
                    href: addr,
                    onload: function(){


                    }
                }));

            }







        });
    }




    function loadJS() {




    }

    loadCSS.loading = loadJS.loading = loadCSS.loaded = loadJS.loaded = false;

    function getIziToast() {








    }


    console.debug(!null, btoa);

    //console.debug('data:text/css;base64,' + btoa(GM_getResourceText(name)), GM_getResourceURL(name));
    console.debug(GM_getResourceURL('kdlfdkl'));











}));

