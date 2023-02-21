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

}(typeof self !== 'undefined' ? self : this, function(exports, utils, emitter, mangas, gmtools, undef){



    const {isNumeric, isBool, uniqid} = utils;
    const {loadCSS} = gmtools.resource;
    const {getResource} = gmtools;
    const {createElement, isString} = utils;
    const {Manga, Chapter} = mangas;


    let template = `<!DOCTYPE html><html><head>
                        <title></title>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                    </head>
                    <body>
                        <header>
                            <a href="#" class="logo"></a>
                            <a href="#" class="button" data-tab="chapters">Select chapters</a>
                            <a href="#" class="button" data-tab="beta">Beta Search</a>
                            <a href="#" class="button" data-tab="download" disabled>Download</a>
                            <button id="close" title="Close" style="position: absolute; top:0; right:0;">&times;</span>
                        </header>
                        <div class="container" data-tab="chapters">
                            <div class="row">
                                <h2>Select Chapters</h2>
                                <div class="input-group vertical col-sm-12">
                                    <label for="chapter-list"></label>
                                    <select id="chapter-list" size="18" multiple></select>
                                </div>
                                <div class="input-group col-sm-12">
                                    <input type="checkbox" id="czip" style="vertical-align: middle;">
                                    <label for="czip">Download as zip file</label>
                                </div>
                                <div class="button-group">
                                    <button id="download-btn" disabled>Download selected as PDF</button>
                                    <button id="select-all-btn">Select all</button>

                                </div>
                            </div>
                        </div>
                        <div class="container" data-tab="beta">
                            <div class="row">

                            </div>
                        </div>
                        <div class="container" data-tab="download">
                            <div class="row">
                                <h2>Download</h2>
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

            return new Promise(resolve => {
                
                emitter(this.root).one('tab.selected', () => {
                    resolve(this.selected);
                });
                
                emitter(this.selected).trigger('tab.selected');

            });

        }

    }


    function init(root, overlay, manga){

        let
                tabs = new TabManager(root),
                selectelem = root.querySelector('#chapter-list'),
                dlbtn = root.querySelector('#download-btn'),
                allbtn = root.querySelector('#select-all-btn'),
                czip = root.querySelector('#czip'),
                dltab = tabs.tabs.download.querySelector('.row');

        loadCSS('minidark', undef, root.head);
        loadCSS('btstutils', undef, root.head);
        loadCSS('asurastyle', undef, root.head);


        overlay.tabmanager = tabs;

        overlay.progressbar = new ProgressBar(dltab, 'Download Queue');


        overlay.progressbar.on('progress.complete', () => {
            overlay.tabmanager.buttons.chapters.removeAttribute('disabled');
        });
        
        emitter(tabs.tabs.download).on('tab.selected', () => {
            overlay.tabmanager.buttons.chapters.setAttribute('disabled', 'true');
        });

        if (!manga.beta) {

            tabs.tabs.beta.hidden = tabs.buttons.beta.hidden = true;

        } else {

            emitter(tabs.tabs.beta).one('tab.selected', e => {


                let container = e.target.querySelector('.row');
                manga.searchResult().then(results => {

                    results.forEach(item => {

                        let
                                a = createElement('a', {class: "card", href: item.href, target: "_blank"}),
                                title = createElement('div', {class: 'section'}, item.title),
                                img = createElement('img', {class: 'section media', style: 'object-fit: contain;', src: item.cover});

                        a.appendChild(title);
                        a.appendChild(img);

                        container.appendChild(a);


                    });



                });
            });


        }



        let handler = emitter(root, overlay);

        handler.on('click', e => {


            if (e.target.closest('#close')) {
                overlay.hide();
            } else if ((target = e.target.closest('header [data-tab].button'))) {
                e.preventDefault();
                tabs.select(target.dataset.tab);
            } else if (e.target.closest('#download-btn')) {

                let options = selectelem.selectedOptions, selection = [], zip = czip.checked === true;

                for (let i = 0; i < options.length; i++) {
                    selection.push(options[i].chapter);
                }

                selection.zip = zip;

                handler.trigger('chapter.selected', selection);

            }

        });


        if (manga instanceof Manga) {

            root.title = root.querySelector('.logo').innerHTML = manga.title;


            manga.chapters.forEach(chapter => {
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

        constructor(root, _label, total, append = true){

            if (isBool(total)) {
                append = total;
                total = undef;
            }

            const id = 'progress-bar-' + uniqid();

            this.elements = {

                root,
                container: createElement('div', {
                    class: 'input-group col-sm-12 progress-bar'
                }),
                label: createElement('label', {
                    class: 'd-block',
                    for : id
                }, _label || ''),
                progress: createElement('progress', {
                    id: id,
                    class: 'primary inline',
                    value: '0',
                    max: '1000',
                    style: "width; 85%;"
                }),
                percent: createElement('span', {class: 'percent'}, '0%')
            };

            this.data = {
                total: 1,
                percent: 0,
                current: 0,
                complete: false
            };

            const {container, progress, percent, label} = this.elements;


            container.appendChild(label);
            container.appendChild(progress);
            container.appendChild(percent);
            emitter(container, this);

            this.on('progress.complete', () => {
                progress.classList.remove('primary', 'secondary');
                progress.classList.add('tertiary');
                label.classList.remove('text-danger');
            }).on('progress.start', () => {
                progress.classList.remove('tertiary', 'secondary');
                progress.classList.add('primary');
                label.classList.remove('text-danger');
            }).on('progress.fail', () => {
                progress.classList.remove('tertiary', 'primary');
                progress.classList.add('secondary');
                label.classList.add('text-danger');
            });

            if (append) {
                root.appendChild(container);
            }


            this.total = total;
        }


        set label(label){

            this.elements.label.innerHTML = label;

        }


        get label(){
            return this.elements.label.innerHTML;
        }




        set total(total){
            if (!isNumeric(total)) {
                total = 1;
            } else {
                total = parseInt(total);
            }

            if (total < 1) {
                total = 1;
            }

            this.data.complete = false;

            this.data.total = total;
            this.current = 0;

            this.trigger('progress.start');
        }

        get total(){
            return this.data.total;
        }

        set current(value){
            this.data.current = parseInt(value);
            let percent = parseInt(Math.floor((parseInt(value) / this.total) * 100));

            if (percent > 100) {
                percent = 100;
            }

            this.data.percent = percent;

            this.elements.percent.innerHTML = `${percent}%`;

            this.elements.progress.value = percent * 10;

            this.trigger('progress.change', this);

            if (percent === 100 && !this.data.complete) {
                this.data.complete = true;
                this.trigger('progress.complete', this);
            }


        }


        get current(){
            return this.data.current;
        }




        get percent(){
            return this.data.percent;
        }


        fail(){
            this.trigger('progress.fail', this);
        }

        remove(){

            this.elements.root.removeChild(this.elements.container);

        }

    }








    class Overlay {

        constructor(manga){
            this.manga = manga;
            this.open = false;

        }

        create(){

            return new Promise(resolve => {
                if (!this.root) {


                    let
                            t = this,
                            manga = this.manga,
                            src = URL.createObjectURL(new Blob([template], {type: "text/html"})),
                            overlay = createElement('div', {class: 'gmconfig_overlay', hidden: true}),
                            frame = createElement('iframe', {
                                class: 'gmconfig_frame',
                                seamless: true,
                                src: src,
                                onload(e){
                                    t.innerdocument = e.target.contentDocument;
                                    init(t.innerdocument, t, manga);
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

        static getInstance(manga){

            let title = manga.title;
            if (!this.instances) {
                loadCSS('overlay');
                this.instances = {};
            }


            if (!this.instances[title]) {
                this.instances[title] = new Overlay(manga);
            }

            return this.instances[title];

        }

        static toggle(manga){


            let instance = this.getInstance(manga);

            if (instance.open) {
                return instance.hide();
            }
            return instance.show();

        }

        static getSelection(manga){

            return new Promise(resolve => {

                this.getInstance(manga).show(manga).then(instance => {

                    instance.tabmanager.select('chapters');

                    instance.one('chapter.selected', e => {
                        resolve(e.detail);
                    });


                });

            });
        }

        static downloadSelection(manga, selection){

            return new Promise((resolve, reject) => {


                if (selection instanceof Chapter) {
                    selection = [selection];
                }

                if (!Array.isArray(selection)) {
                    return reject(new Error('selection is invalid'));
                }


                this.getInstance(manga).show(manga).then(instance => {
                    instance.tabmanager.select('download');
                    resolve(instance);

                });


            });

        }
    }







    Object.assign(exports, {Overlay, ProgressBar});

}));