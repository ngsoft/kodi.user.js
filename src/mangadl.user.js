/* globals self, unsafeWindow */

(function(global, root, undef){

    const {PDFDocument} = PDFLib;

    const {Manga, Chapter, ChapterImage} = root.manga;

    const isBeta = /^beta/.test(location.host);



    let= (() => {
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

                    let href = el.href, current = el.classList.contains('active');
                    if (!ulist.includes(href)) {
                        chapterList.push(new Chapter(href, el.innerText, current));
                        ulist.push(href);
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

                let href = el.value, current = el.selected === true;
                if (!ulist.includes(href)) {
                    chapterList.push(new Chapter(href, el.innerText, current));
                    ulist.push(href);
                }

            });


        }

        return new Manga(title, description, chapterList);

    })();



    console.debug(root.gmtools);



})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, typeof self !== 'undefined' ? self : this);

