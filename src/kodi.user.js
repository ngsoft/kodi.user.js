

/* globals self, unsafeWindow */

(function (global, root) {

    const {document} = global;

    root.gmconfig.initialize();





})(
    typeof unsafeWindow !== 'undefined' ? unsafeWindow : window,
    typeof self !== 'undefined' ? self : this
);


