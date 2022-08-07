


/* globals self, unsafeWindow */

(function(global, root){

    const {emitter, finder} = root;
    const {JSON, document, intVal} = root.utils;
    const {menu, setClipboard} = root.gmtools;

    emitter.on('page.replacestate', e => {
        let
                number = intVal(document.querySelector('a.active').dataset.num),
                title = document.querySelector('.info .title').innerHTML, matches, season = '';

        if (number < 10) {
            number = "0" + number;
        }

        if ((matches = / Season (\d+)/i.exec(title))) {
            season = intVal(matches[1]);

            if (season < 10) {
                season = '0' + season;
            }

            season = 'S' + season;
            title = title.replace(matches[0], '');
        }



        document.title = `${title}.${season}E${number}`;

    });


    let videolink;

    finder.find('#player iframe[src]', elem => {

        videolink = elem.src;
        menu.addItem('Copy video link', () => {
            setClipboard(videolink, 'text');
        }, 'cvl');


    });










})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, typeof self !== 'undefined' ? self : this);

/**
 * History Patcher
 */

(function(global, root){

    const replace = global.history.replaceState, push = global.history.pushState
    , {emitter} = root;


    Object.assign(global.history, {
        pushState: function pushState(state, title, url){
            emitter.trigger('page.pushstate', {
                state, title, url
            });

            return push.call(global.history, state, title, url);
        },
        replaceState: function replaceState(state, title, url){
            emitter.trigger('page.replacestate', {
                state, title, url
            });

            return replace.call(global.history, state, title, url);
        }
    });


})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, typeof self !== 'undefined' ? self : this);