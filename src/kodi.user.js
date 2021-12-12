


(function (global, root) {

    const { document } = root.gmtools.window;

    const { GM_Storage, xsessionStorage } = root.storage;

    const { emitter } = root.emitter;


    xsessionStorage.onValueChange('myKey2', (...args) => {
        console.debug(args);
    });

    xsessionStorage.onValueChange('myKey', (...args) => {
        console.debug(args);
    });


    xsessionStorage.offValueChange('myKey2');

    xsessionStorage.set('myKey', 'myNewValue');


    xsessionStorage.set('myKey2', ['myNewValue' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)]);














})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, typeof self !== 'undefined' ? self : this);


