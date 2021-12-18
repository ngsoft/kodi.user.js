

/* globals self, unsafeWindow */

(function (global, root) {

    const {document} = global;
    notify.title = gmtools.info.script.name;
    notify.error('My error message').then(izi => {
        izi.success('My success Message', 'My title');
    })




})(
    typeof unsafeWindow !== 'undefined' ? unsafeWindow : window,
    typeof self !== 'undefined' ? self : this
);


