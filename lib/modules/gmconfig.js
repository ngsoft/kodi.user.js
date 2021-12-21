/** gmconfig.js */
(function(root, factory){
    /* globals define, require, module, self, exports */
    let name = 'gmconfig', deps = ['emitter'];
    if (typeof define === 'function' && define.amd) {
        define(name, deps, factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        module.exports = factory(...deps.map(d => require(d)));
    } else {
        root[name] = factory(...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function(emitter){















}));
