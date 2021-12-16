

/* globals self, unsafeWindow */

(function (global, root) {

    const { document } = global;



    console.debug(gmtools);

  
    

    runat.documentEnd().then(a => console.debug('end', a));
    runat.documentIdle().then(a => console.debug('idle', a));
runat.documentBody().then(a => console.debug('body', a));
  runat.documentStart().then(a => console.debug('start', a));



})(
    typeof unsafeWindow !== 'undefined' ? unsafeWindow : window,
    typeof self !== 'undefined' ? self : this
);


