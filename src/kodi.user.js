

/* globals self, unsafeWindow */

(function (global, root) {

    const {document} = global;



    nodefinder.finder.find('img', console.debug);
    nodefinder.finder.findOne('div').then(console.debug);











})(
    typeof unsafeWindow !== 'undefined' ? unsafeWindow : window,
    typeof self !== 'undefined' ? self : this
);


