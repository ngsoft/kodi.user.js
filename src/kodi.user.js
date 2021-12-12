


(function(global, root){
    
    const {document} = root.gmtools.window;

    const {GM_Storage} = root.storage;

    const {emitter} = root.emitter;

    console.debug(emitter);


    emitter.one('t', function(e){
        console.debug('one', e, this);
    }).on('t', function(e){
        console.debug('on', e, this);

    }).trigger('t t t t');















    
})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, typeof self !== 'undefined' ? self : this);


