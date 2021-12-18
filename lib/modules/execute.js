/** GM_execute.js */
(function(root, factory){
    /* globals define, require, module, self, exports */
    let name = 'GM_execute', deps = [];
    if (typeof define === 'function' && define.amd) {
        define(name, deps, factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        module.exports = factory(...deps.map(d => require(d)));
    } else {
        root[name] = factory(...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function(){

    /*jslint evil: true */

    function execute(code){
        eval(code);
    }


    return function GM_execute(code, context = typeof self !== "undefined" ? self : this){

        let result;
        return new Promise((rsl, rej) => {
            try {
                result = handler.call(context, code);
                rsl(result);
                
            } catch (e) {
                rej(e);
            }
        });
    };
}));

