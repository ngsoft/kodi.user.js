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
    const {createElement, isString} = utils;
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
                            <h2>Select Chapters</h2>
                            <div class="input-group vertical">
                                <select id="chapter-list" size="18" multiple></select>
                                <div class="button-group">
                                    <button id="download-btn" disabled>Download selected as PDF</button>
                                    <button id="select-all-btn">Select all</button>

                                </div>
                            </div>
                        </div>
                        <div class="container" data-tab="download">
                            <h2>Download</h2>
                            <progress value="0" max="1000" class="primary"></progress>
                        </div>

                    </body></html>`;



    class TabManager {

        constructor(root, select){
            this.root = root;
            this.tabs = {};
            this.buttons = {};
            this.current = null;

            root.querySelectorAll('[data-tab].button').forEach(btn => {
                this.buttons[btn.dataset.tab] = btn;
            });


            root.querySelectorAll('[data-tab].container').forEach(div => {
                this.tabs[div.dataset.tab] = div;
            });


            if (isString(select)) {
                this.current = this.select(select);
            } else {

                let current = root.querySelector('[data-tab][data-selected].button');
                if (current === null) {
                    current = root.querySelector('[data-tab].button');
                }
                if (current !== null) {
                    this.select(current.dataset.tab);
                }

            }

        }


        select(name){

            Object.keys(this.buttons).forEach(btn => delete this.buttons[btn].dataset.selected);
            Object.keys(this.tabs).forEach(tab => this.tabs[tab].hidden = true);

            this.buttons[name].dataset.selected = "true";
            this.tabs[name].hidden = null;
            this.selected = this.tabs[name];
            return this.selected;
        }



    }





    function init(root, _manga){

        let tabs = new TabManager(root);

        emitter(root).on('click', e => {


            if (e.target.closest('#close')) {
                Overlay.hide();
            } else if ((target = e.target.closest('header [data-tab].button'))) {
                e.preventDefault();
                tabs.select(target.dataset.tab);
            }
        });


        if (_manga instanceof Manga) {

            let 
                    selectelem = root.querySelector('#chapter-list'),
                    dlbtn = root.querySelector('#download-btn'),
                    allbtn = root.querySelector('#select-all-btn');

            root.title = root.querySelector('.logo').innerHTML = _manga.title;





            _manga.chapters.forEach(chapter => {
                let opt = createElement('option', {value: chapter.url}, chapter.label);
                opt.chapter = chapter;
                selectelem.appendChild(opt);
            });


            emitter(allbtn).on('click', () => {
                selectelem.childNodes.forEach(el => el.selected = true);
                emitter(selectelem).trigger('change');


            });


            emitter(selectelem).on('change', e => {
                console.debug(e);
                
                let options = e.target.selectedOptions;
                dlbtn.disabled = true;

                if (options.length > 0) {
                    dlbtn.disabled = null;
                }
                
                
            });

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