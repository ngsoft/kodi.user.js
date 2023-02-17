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
    const {createElement} = utils;

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
                            <a href="#" class="button" data-tab="download">Download</a>
                            <button id="close" title="Close" style="position: absolute; top:0; right:0;">&times;</span>
                        </header>

                    </body></html>`;








    class Overlay {

        static async create(){

            if (!(this.root instanceof Element)) {
                loadCSS('overlay');

                let
                        src = URL.createObjectURL(new Blob([template], {type: "text/html"})),
                        overlay = createElement('div', {class: 'gmconfig_overlay'}),
                        frame = createElement('iframe', {
                            class: 'gmconfig_frame',
                            seamless: true,
                            src: src,
                            onload(){
                                // URL.revokeObjectURL(src);
                            }
                        }),
                        style = createElement('style', {type: 'text/css'}),
                        pos = 0;


                overlay.appendChild(frame);
                this.root = overlay;
                this.frame = frame;
                this.style = style;

                emitter(overlay).on('click', e => {

                    if (e.target.closest('.gmconfig_frame') !== null) {
                        return;
                    }

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
                            document.body.appendChild(overlay);

                            this.open = true;
                        })
                        .on('overlay.hide', e => {
                            e.preventDefault();
                            // document.body.removeChild(overlay);
                            overlay.hidden = true;
                            document.documentElement.classList.remove('noscroll');
                            if (pos > 0) document.documentElement.scrollTo(0, pos);
                            this.open = false;

                        })
                        .on('click', e => {

                            if (e.target.closest('#close') !== null) {
                                e.preventDefault();
                                this.hide();
                            }

                        });
            }

            return this.frame;

        }

        static async show(){

            let elem = await this.create();

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

        static toggle(){
            if (this.open) {
                return this.hide();
            }
            return this.show();

        }
    }


    Object.assign(exports, {Overlay});

}));