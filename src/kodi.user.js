

/* globals self, unsafeWindow */

(function (global, root) {

    const {document} = global;



    storage.xsessionStorage.onValueChange('key', console.debug);






    storage.xsessionStorage.set('key', 'fdfmldm').then(() => {
        //storage.GM_Storage.offValueChange('key');
        storage.xsessionStorage.set('key2', 'fdfmldm');
        storage.xsessionStorage.set('key', 'dsdsdsd');
    });









})(
    typeof unsafeWindow !== 'undefined' ? unsafeWindow : window,
    typeof self !== 'undefined' ? self : this
);


