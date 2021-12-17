

/* globals self, unsafeWindow */

(function (global, root) {

    const {document} = global;

    const {xsessionStorage, GM_Storage} = storage;




    xsessionStorage.onValueChange('myKey', console.debug);


    xsessionStorage.set({
        dsdskd: 'kslkdsd',
        dfkdlfd: [1, 2, 3, 4],
        myKey: {mcllm: true, lmdlf: [5, 6, 7, 8], lmdlf: null, kklfm: 5562},
        kklfm: 5562
    }).then(()=>{
        xsessionStorage.clear().then(() => {
            console.debug(xsessionStorage.storage);
        });
    });




    //xsessionStorage.set('kdlfkd', true).then(console.debug);

    //xsessionStorage.set('myKey', true);

    //xsessionStorage.set('myKey', false);

    //xsessionStorage.offValueChange('myKey');

    //xsessionStorage.set('myKey', {obj: 'djfkd'});
    // xsessionStorage.remove('myKey');


    /*

    GM_Storage.onValueChange('myKey', console.debug);



    GM_Storage.set('kdlfkd', true).then(console.debug);

    GM_Storage.set('myKey', true);

    GM_Storage.set('myKey', false);

    GM_Storage.set('myKey', {obj: 'djfkd'});

    GM_Storage.remove('myKey');
*/



})(
    typeof unsafeWindow !== 'undefined' ? unsafeWindow : window,
    typeof self !== 'undefined' ? self : this
);


