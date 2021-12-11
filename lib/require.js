
(function(global, sandbox){


    function execute(code){

        try {
            /*jslint evil: true */
            global.eval(code);
            return true;
        } catch (e) {
            console.error(e);
        }
        return false;

    };

    Object.assign(sandbox, {execute});

}(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, self));


(function(global, sandbox){












}(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, self));