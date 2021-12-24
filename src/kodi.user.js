

/* globals self, unsafeWindow */

(function(global, root){


    root.gmconfig.initialize();

    root.notify.message('Userscript loaded');











})(
    typeof unsafeWindow !== 'undefined' ? unsafeWindow : window,
    typeof self !== 'undefined' ? self : this
);


