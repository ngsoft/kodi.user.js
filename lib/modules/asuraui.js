/** asuraui.js */
(function(root, factory){
    /* globals define, require, module, self, exports */
    let name = 'asuraui', deps = ['utils', 'emitter', 'manga', 'gmtools'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        factory(root[name] = {}, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function(exports, utils, emitter, manga, gmtools){


    const {loadCSS} = gmtools.resource;
    const {getResource} = gmtools;
    const {createElement} = utils;
    const {Manga} = manga;

    let template = `<!DOCTYPE html><html><head>
                        <title></title>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-dark.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
                        <style type="text/css">
                            [hidden], template {display: none !important;}
                            [data-tab][data-selected].button{pointer-events: none;background: var(--header-hover-back-color);}
                        </style>
                    </head>
                    <body>
                        <header>
                            <a href="#" class="logo"></a>
                            <a href="#" class="button" data-tab="chapters">Select chapters</a>
                            <a href="#" class="button" data-tab="download">Download</a>
                            <button id="close" title="Close" style="position: absolute; top:0; right:0;">&times;</span>
                        </header>
                        <div class="container" data-tab="chapters">
                            <h1>Chapters</h1>
                        </div>
                        <div class="container" data-tab="download">
                            <h1>Download</h1>
                            <progress value="450" max="1000" class="primary"></progress>
                        </div>

                    </body></html>`;





    function init(root, _manga){




        emitter(root).on('click', e => {


            if (e.target.closest('#close')) {

                Overlay.hide();
            } else if ((target = e.target.closest('header [data-tab].button'))) {
                e.preventDefault();
                let
                        tab = target.dataset.tab,
                        tabContainer = root.querySelector(`[data-tab="${tab}"].container`);
                root.querySelectorAll('header [data-tab].button').forEach(btn => delete btn.dataset.selected);
                root.querySelectorAll('[data-tab].container').forEach(cnt => cnt.hidden = true);
                target.dataset.selected = true;
                if (tabContainer) {
                    tabContainer.hidden = null;
                }
            }
        });


        if (_manga instanceof Manga) {

            root.title = root.querySelector('.logo').innerHTML = _manga.title;

        }



    }




    class Overlay {

        static async create(_manga){

            if (!(this.root instanceof Element)) {
                loadCSS('overlay');

                let
                        src = URL.createObjectURL(new Blob([template], {type: "text/html"})),
                        overlay = createElement('div', {class: 'gmconfig_overlay', hidden: true}),
                        frame = createElement('iframe', {
                            class: 'gmconfig_frame',
                            seamless: true,
                            src: src,
                            onload(e){

                                init(e.target.contentDocument, _manga);

                                URL.revokeObjectURL(src);

                            }
                        }),
                        style = createElement('style', {type: 'text/css'}),
                        pos = 0;


                overlay.appendChild(frame);
                this.root = overlay;
                this.frame = frame;
                this.style = style;

                emitter(overlay).on('click', e => {



                    e.preventDefault();
                    this.hide();


                });


                emitter(frame)
                        .on('overlay.show', e => {
                            e.preventDefault();
                            pos = document.documentElement.scrollTop;
                            if (pos < 0) {
                                pos = 0;
                            }
                            this.style.innerHTML += `html.noscroll{top:-${pos}px;}`;
                            document.documentElement.classList.add('noscroll');
                            overlay.hidden = null;
                            this.open = true;
                        })
                        .on('overlay.hide', e => {
                            e.preventDefault();
                            document.documentElement.classList.remove('noscroll');
                            if (pos > 0) document.documentElement.scrollTo(0, pos);
                            this.open = false;
                            overlay.hidden = true;

                        });
                document.body.appendChild(overlay);
            }

            return this.frame;

        }

        static async show(_manga){

            let elem = await this.create(_manga);

            if (this.open) {
                return elem;
            }

            emitter(elem).trigger('overlay.show');
            return elem;

        }
        static async hide(){
            let elem = await this.create();
            if (this.open) {
                emitter(elem).trigger('overlay.hide');
            }

            return elem;

        }

        static toggle(_manga){
            if (this.open) {
                return this.hide();
            }
            return this.show(_manga);

        }
    }


    Object.assign(exports, {Overlay});

}));