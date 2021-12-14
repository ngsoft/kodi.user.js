/** notify.js */
(function(root, factory){
    /* globals define, require, module, self, exports */
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


    const repo = 'https://cdn.jsdelivr.net/npm/izitoast/dist', js = '', css = '';










}));

