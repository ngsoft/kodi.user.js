/** asuraui.js */
(function(root, factory){
    /* globals define, require, module, self, exports */
    let name = 'asuraui', deps = ['utils', 'emitter', 'mangas', 'gmtools'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        factory(root[name] = {}, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function(exports, utils, emitter, mangas, gmtools){



    const {isNumeric} = utils;
    const {loadCSS} = gmtools.resource;
    const {getResource} = gmtools;
    const {createElement, isString} = utils;
    const {Manga, Chapter} = mangas;


    let template = `<!DOCTYPE html><html><head>
                        <title></title>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-dark.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
                    </head>
                    <body>
                        <header>
                            <a href="#" class="logo"></a>
                            <a href="#" class="button" data-tab="chapters">Select chapters</a>
                            <a href="#" class="button" data-tab="download" disabled>Download</a>
                            <button id="close" title="Close" style="position: absolute; top:0; right:0;">&times;</span>
                        </header>
                        <div class="container" data-tab="chapters">
                            <div class="row">
                                <h2>Select Chapters</h2>
                                <div class="input-group vertical col-sm-12">
                                    <select id="chapter-list" size="18" multiple></select>
                                    <div class="button-group">
                                        <button id="download-btn" disabled>Download selected as PDF</button>
                                        <button id="select-all-btn">Select all</button>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="container" data-tab="download">
                            <div class="row">
                                <h2>Download</h2>
                                <div class="input-group vertical col-sm-12">
                                    <label for="progress-bar">Label</label>
                                    <progress value="0" max="1000" class="primary inline" id="progress-bar" style="width: 90%;"></progress>
                                    <span class="percent">0%</span>
                                </div>
                            </div>
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
                    current = root.querySelector('[data-tab].button:not([disabled])');
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


    function init(root, overlay, _manga){

        let
                tabs = new TabManager(root),
                selectelem = root.querySelector('#chapter-list'),
                dlbtn = root.querySelector('#download-btn'),
                allbtn = root.querySelector('#select-all-btn');

        overlay.tabmanager = tabs;

        overlay.progressbar = new ProgressBar(overlay.tabmanager.tabs.download);

        let handler = emitter(root, overlay);

        handler.on('click', e => {


            if (e.target.closest('#close')) {
                overlay.hide();
            } else if ((target = e.target.closest('header [data-tab].button'))) {
                e.preventDefault();
                tabs.select(target.dataset.tab);
            } else if (e.target.closest('#download-btn')) {

                let options = selectelem.selectedOptions, selection = [];

                for (let i = 0; i < options.length; i++) {
                    selection.push(options[i].chapter);
                }

                handler.trigger('chapter.selected', selection);

            }

        });


        if (_manga instanceof Manga) {

            root.title = root.querySelector('.logo').innerHTML = _manga.title;


            _manga.chapters.forEach(chapter => {
                let opt = createElement('option', {value: chapter.url}, chapter.label);
                Object.defineProperty(opt, 'chapter', {
                    enumerable: false, configurable: true, writable: true, value: chapter
                });
                selectelem.appendChild(opt);
            });


            emitter(allbtn).on('click', () => {
                selectelem.childNodes.forEach(el => el.selected = true);
                emitter(selectelem).trigger('change');


            });


            emitter(selectelem).on('change', e => {

                let options = e.target.selectedOptions;
                dlbtn.disabled = true;

                if (options.length > 0) {
                    dlbtn.disabled = null;
                }
            });

        }



    }



    class ProgressBar {


        set total(total){
            if (!isNumeric(total)) {
                total = 1;
            } else {
                total = parseInt(total);
            }

            if (total < 1) {
                total = 1;
            }

            this.data.total = total;
            this.current = 0;
        }

        get total(){
            return this.data.total;
        }

        get percent(){
            return parseInt(this.data.percentElement.innerText);
        }

        set percent(percent){
            this.data.percentElement.innerHTML = percent;
            this.data.progressElement.value = percent * 10;
        }


        set current(value){
            this.data.current = parseInt(value);
            this.percent = parseInt(Math.floor((parseInt(value) / this.total) * 100));
        }


        get current(){
            return this.data.current;
        }


        constructor(tab, total){

            this.data = {
                total: 1,
                percent: 0,
                current: 0,
                progressElement: tab.querySelector('#progress-bar'),
                percentElement: tab.querySelector('.percent')

            };

            this.total = total;

        }


    }



    class Overlay {

        constructor(_manga){
            this.manga = _manga;
            this.open = false;

        }

        create(){

            return new Promise(resolve => {
                if (!this.root) {


                    let
                            t = this,
                            _manga = this.manga,
                            src = URL.createObjectURL(new Blob([template], {type: "text/html"})),
                            overlay = createElement('div', {class: 'gmconfig_overlay', hidden: true}),
                            frame = createElement('iframe', {
                                class: 'gmconfig_frame',
                                seamless: true,
                                src: src,
                                onload(e){
                                    t.innerdocument = e.target.contentDocument;
                                    init(t.innerdocument, t, _manga);
                                    URL.revokeObjectURL(src);
                                    resolve(t);
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
                }else{
                    resolve(this);
                }


            });



        }

        async show(){

            let instance = await this.create();

            if (this.open) {
                return instance;
            }

            emitter(instance.frame).trigger('overlay.show');
            return instance;

        }
        async hide(){
            let instance = await this.create();
            if (this.open) {
                emitter(instance.frame).trigger('overlay.hide');
            }

            return instance;

        }

        static getInstance(_manga){

            let title = _manga.title;
            if (!this.instances) {
                loadCSS('overlay');
                this.instances = {};
            }


            if (!this.instances[title]) {
                this.instances[title] = new Overlay(_manga);
            }

            return this.instances[title];

        }

        static toggle(_manga){


            let instance = this.getInstance(_manga);

            if (instance.open) {
                return instance.hide();
            }
            return instance.show();

        }

        static getSelection(_manga){

            return new Promise(resolve => {

                this.getInstance(_manga).show(_manga).then(instance => {

                    instance.tabmanager.select('chapters');

                    instance.one('chapter.selected', e => {
                        resolve(e.detail);
                    });


                });

            });
        }

        static downloadSelection(_manga, selection){

            return new Promise((resolve, reject) => {


                if (selection instanceof Chapter) {
                    selection = [selection];
                }

                if (!Array.isArray(selection)) {
                    return reject(new Error('selection is invalid'));
                }


                this.getInstance(_manga).show(_manga).then(instance => {
                    instance.tabmanager.select('download');
                    resolve(instance);

                });


            });

        }
    }







    Object.assign(exports, {Overlay});

}));