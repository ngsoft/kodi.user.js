
/* globals self, unsafeWindow */

(function(global, root){


    global.tampermonkey = root;

    console.debug(location.origin, global.top, global.self, global.top === global.self);










})(
        typeof unsafeWindow !== 'undefined' ? unsafeWindow : window,
        typeof self !== 'undefined' ? self : this
        );
