/* globals self, unsafeWindow */

(function(global, root, undef){

    const {emitter} = root;
    const {getResource, menu} = root.gmtools;
    const{loadCSS} = root.gmtools.resource;
    const {createElement} = root.utils;

    const {PDFDocument} = PDFLib;

    const {Manga, Chapter, ChapterImage} = root.manga;

    let isBeta = /^beta/.test(location.host), currentChapter = null;



    let series = (() => {
        if (isBeta) {


            let
                    details = document.querySelector('#__next main .series-details'),
                    isChapter = document.querySelector('#__next main .chapter-section .main-container .container');

            let
                    chapterList = [],
                    title = details !== null ?
                    details.querySelector('h2').innerText :
                    isChapter.querySelector('a[href*="/comics/"]').innerText,
                    description = details === null ? '' : details.querySelector('p').innerText, ulist = [];


            if (details !== null) {


                document.querySelectorAll('.chapters-section a[href*="/read/"]').forEach(el => {

                    if (!ulist.includes(el.href)) {
                        chapterList.push(new Chapter(el.href, el.querySelector('h5.chapter-link').innerText));
                        ulist.push(el.href);
                    }

                });
            } else {
                document.querySelector('.chapter-section .dropdown-menu').querySelectorAll('a.dropdown-item').forEach(el => {

                    let href = el.href, current = el.classList.contains('active'), chap;
                    if (!ulist.includes(href)) {
                        chapterList.push((chap = new Chapter(href, el.innerText, current)));
                        ulist.push(href);
                    }

                    if (current) {
                        currentChapter = chap;
                    }



                });


            }

            return new Manga(title, description, chapterList);


        }
        let
                details = document.querySelector('.infox'),
                isChapter = document.querySelector('.chapterbody .postarea article');

        let
                chapterList = [],
                title = details !== null ?
                details.querySelector('h1.entry-title').innerText :
                isChapter.querySelector('.headpost .allc a').innerText,
                description = details === null ? '' : details.querySelector('.entry-content-single').innerText, ulist = [];


        if (details !== null) {
            document.querySelectorAll('#chapterlist .chbox a').forEach(el => {
                if (!ulist.includes(el.href)) {
                    chapterList.push(new Chapter(el.href, el.querySelector('.chapternum').innerText));
                    ulist.push(el.href);
                }

            });
        } else {
            document.querySelector('.selector').querySelectorAll('select#chapter option[value*="https"]').forEach(el => {

                let href = el.value, current = el.selected === true, chap;
                if (!ulist.includes(href)) {
                    chapterList.push((chap = new Chapter(href, el.innerText, current)));
                    ulist.push(href);
                }

                if (current) {
                    currentChapter = chap;
                }

            });


        }

        return new Manga(title, description, chapterList);

    })();



    class Overlay {

        static async create(){

            if (!(this.root instanceof Element)) {
                loadCSS('overlay');

                let
                        overlay = createElement('div', {class: 'gmconfig_overlay'}),
                        frame = createElement('div', {class: 'gmconfig_frame'}),
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
                            document.body.removeChild(overlay);
                            document.documentElement.classList.remove('noscroll');
                            if (pos > 0) document.documentElement.scrollTo(0, pos);
                            this.open = false;
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

    menu.clear();
    
    if (series) {



        if (currentChapter !== null) {
            menu.addItem('Download ' + currentChapter.label, () => {
                alert('Downloading ' + currentChapter.label);
            });
        }

        menu.addItem('Download Manga', () => {
            Overlay.toggle();

        });
    }




    console.debug(series);

})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, typeof self !== 'undefined' ? self : this);

