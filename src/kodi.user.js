


(function (global, root) {

    const { document } = root.gmtools.window;

    const {GM_Storage, xsessionStorage, MemoryStorage} = root.storage;

    const { emitter } = root.emitter;

    const mem = new MemoryStorage();

    mem.onValueChange('myKey2', (...args) => {
        console.debug(args);
    });

    mem.onValueChange('myKey', (...args) => {
        console.debug(args);
    });







    mem.set('myKey2', ['myNewValue' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)]).then(() => {
        //mem.offValueChange('myKey2');
        mem.set('myKey2', ['myNewValue' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)]);
    });
    mem.set('myKey', 'myNewValue');















})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, typeof self !== 'undefined' ? self : this);


