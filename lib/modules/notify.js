/** notify.js */
(function(root, factory){
    /* globals define, require, module, self, exports, iziToast */
    let name = 'notify', deps = ['gmtools'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        let exports = root[name] = {};
        factory(exports, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function(exports, gmtools){

    const {document} = gmtools.window;

    const
            repo = 'https://cdn.jsdelivr.net/npm/izitoast/dist',
            js = '/js/iziToast.js',
            css = '/css/iziToast.css';

    let
            gmresource = gmtools.metadata.resource || {},
            supports = {
                GM_getResourceText: (gmtools.metadata.grant || []).includes('GM_getResourceText'),
                GM_addStyle: (gmtools.metadata.grant || []).includes('GM_addStyle'),
            },
            resources = {
                css: {
                    loaded: false,
                    loading: false,
                    getResourceKey(){
                        let key;
                        if (supports.GM_getResourceText && supports.GM_addStyle) {
                            Object.keys(gmresource).forEach(k => {
                                if (gmresource[k] === repo + css) key = k;
                            });
                        }
                        return key;
                    },
                    load(){
                        return new Promise(rsl => {
                            if (!this.loaded) {
                                let key;
                                if ((key = this.getResourceKey())) {
                                    gmtools.addStyle(gmtools.getResourceText(key));
                                    this.loaded = true;
                                    rsl();
                                    return;
                                }
                                let worker = () => {
                                    if (!resources.css.loaded) {
                                        setTimeout(() => {
                                            worker();
                                        }, 20)
                                    }
                                    rsl();
                                };
                                if (!this.loading) {
                                    this.loading = true;
                                    document.head.appendChild(Object.assign(document.createElement('link'), {
                                        rel: "stylesheet",
                                        type: "text/css",
                                        onload(){
                                            resources.css.loaded = true;
                                        },
                                        href: repo + css
                                    }));
                                }
                                worker();
                            } else rsl();
                        });
                    }

                },
                js: {
                    loaded: typeof iziToast !== 'undefined',
                    loading: false,
                    load: function(){
                        return new Promise(rsl => {

                            if (!this.loaded) {
                                let worker = () => {
                                    if (typeof iziToast === "undefined") {
                                        setTimeout(() => {
                                            worker();
                                        }, 20);
                                        return;
                                    }
                                    this.loaded = true;
                                    rsl(iziToast);
                                };
                                if (!this.loading) {
                                    this.loading = true;
                                    document.head.appendChild(Object.assign(document.createElement('script'), {
                                        type: 'text/javascript',
                                        src: repo + js
                                    }));
                                } 
                                worker();
                            } else rsl(iziToast);
                        });
                    }
                }

            };


    function getIziToast(){
        return new Promise(rsl => {
            resources.css.load().then(() => {
                resources.js.load().then(izi => rsl(izi));
            });
        });
    }













}));

