

/* globals self, unsafeWindow */

(function (global, root) {

    const {document} = global;



    finder.findOne('div').then(node => {
        console.debug(node);
        finder(node).find('div', console.debug);
        //request.abort();
    });








})(
    typeof unsafeWindow !== 'undefined' ? unsafeWindow : window,
    typeof self !== 'undefined' ? self : this
);


