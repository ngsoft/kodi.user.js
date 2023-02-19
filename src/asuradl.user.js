/* globals self, unsafeWindow */

(function(global, root, undef){

    const {menu} = root.gmtools;

    const {PDFDocument} = PDFLib;

    const {Overlay} = root.asuraui;
    const {Manga, Chapter, ChapterImage} = root.mangas;

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





    menu.clear();
    
    if (series) {

        if (currentChapter !== null) {
            menu.addItem('Download ' + currentChapter.label, () => {
                Overlay.downloadSelection(series, currentChapter).then(console.debug);
            });
        }

        menu.addItem('Download Manga', () => {
            Overlay.getSelection(series).then(sel => {

                Overlay.downloadSelection(series, sel).then(console.debug);
            });

        });
    }





})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, typeof self !== 'undefined' ? self : this);

