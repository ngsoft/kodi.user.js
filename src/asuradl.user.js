/* globals self, unsafeWindow */

(function(global, root, undef){

    const {menu} = root.gmtools;

    const {PDFDocument} = PDFLib;

    const {Overlay, ProgressBar} = root.asuraui;
    const {Manga, Chapter, handleFetchError} = root.mangas;
    const {html2doc, createElement, uniqid} = utils;
    const {ConcurrentPromiseQueue} = root.cpromise;

    const {fetch} = gmfetch;


    let isBeta = /^beta/.test(location.host), currentChapter = null, downloading = false;


    function getImageList(doc){
        let images = [];
        doc.querySelectorAll('.main-container img[src*="img.asurascans.com"], #readerarea img')
                .forEach(img => images.push(img.src));
        return images;
    }


    function downloadFile(body, filename, extension){
        let
                blob = new Blob([body]),
                fileName = `${filename}.${extension}`,
                href = URL.createObjectURL(blob),
                a = createElement('a', {
                    href: href,
                    download: fileName,
                    style: 'visibility: hidden'
                });

        setTimeout(() => {
            URL.revokeObjectURL(href);
        }, 15000);
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    }


    async function searchBeta(query){

        if (!query) {
            throw new Error('invalid query');
        }

        let src = new URL('https://www.asurascans.com/');

        src.searchParams.set('s', query);

        let doc = await fetch(src)
                .then(handleFetchError)
                .then(resp => resp.text())
                .then(txt => html2doc(txt));

        let results = [];


        doc.querySelectorAll('.listupd a[title]').forEach(a => {
            results.push({
                title: a.title,
                href: a.href,
                cover: a.querySelector('img').src
            });
        });


        return results;
    }



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
                    ulist = [];


            if (details !== null) {


                document.querySelectorAll('.chapters-section a[href*="/read/"]').forEach(el => {

                    if (!ulist.includes(el.href)) {
                        chapterList.push(new Chapter(el.href, el.querySelector('h5.chapter-link').innerText, getImageList));
                        ulist.push(el.href);
                    }

                });
            } else {
                document.querySelector('.chapter-section .dropdown-menu').querySelectorAll('a.dropdown-item').forEach(el => {

                    let href = el.href, current = el.classList.contains('active'), chap;
                    if (href === '') {
                        href = location.href;
                    }
                    if (!ulist.includes(href)) {
                        chapterList.push((chap = new Chapter(href, el.innerText, getImageList)));
                        ulist.push(href);
                    }

                    if (current) {
                        currentChapter = chap;
                    }



                });


            }

            return new Manga(title, chapterList, true, searchBeta);
        }

        let
                details = document.querySelector('.infox'),
                isChapter = document.querySelector('.chapterbody .postarea article');

        let
                chapterList = [],
                title = details !== null ?
                details.querySelector('h1.entry-title').innerText :
                isChapter.querySelector('.headpost .allc a').innerText,
                ulist = [];


        if (details !== null) {
            document.querySelectorAll('#chapterlist .chbox a').forEach(el => {
                if (!ulist.includes(el.href)) {
                    chapterList.push(new Chapter(el.href, el.querySelector('.chapternum').innerText, getImageList));
                    ulist.push(el.href);
                }

            });
        } else {
            document.querySelector('.selector').querySelectorAll('select#chapter option[value*="https"]').forEach(el => {

                let href = el.value, current = el.selected === true, chap;
                if (!ulist.includes(href)) {
                    chapterList.push((chap = new Chapter(href, el.innerText, getImageList)));
                    ulist.push(href);
                }

                if (current) {
                    currentChapter = chap;
                }

            });


        }



        return new Manga(title, chapterList.reverse());

    })();








    function downloadChapter(selection, ui, qlength = 5){
        return new Promise((resolve, reject) => {

            let
                    tot = selection.length,
                    mainprogressbar = ui.progressbar,
                    current = 0,
                    success = [],
                    failed = [],
                    last = null;


            mainprogressbar.total = tot;


            if (tot > 0) {
                downloading = true;
            } else {
                return reject(new Error('selection is empty'));
            }




            let interval = setInterval(() => {
                if (success.length + failed.length === tot) {

                    clearInterval(interval);
                    downloading = false;
                    resolve({success: success, failed: failed});

                }
            }, 100);


            const queue = new ConcurrentPromiseQueue({maxNumberOfConcurrentPromises: qlength});


            for (let i = 0; i < selection.length; i++) {

                let chapter = selection[i];


                queue.addPromise(() => {

                    let progress = new ProgressBar(ui.tabmanager.tabs.download.querySelector('.row'), chapter.label);

                    progress.on('progress.complete', e => {
                        setTimeout(() => {
                            e.detail.remove();
                        }, 2000);

                    });

                    return chapter.getPDF(progress).then(pdf => {

                        downloadFile(pdf, chapter.label, 'pdf');
                        current++;
                        mainprogressbar.current = current;

                        success.push(chapter);

                    }).catch(() => {
                        progress.fail();
                        failed.push(chapter);
                    });
                });


            }



        });
    }



    menu.clear();
    
    if (series) {

        if (currentChapter !== null) {
            menu.addItem('Download ' + currentChapter.label, () => {
                if (!downloading) {
                    Overlay.downloadSelection(series, currentChapter).then(ui => {
                        downloadChapter([currentChapter], ui);
                    });
                    menu.removeItem('chapdl');
                }

            }, 'chapdl');
        }
        
        
        Overlay.getInstance(series).hide().then(ui => {
            ui.on('chapter.selected', e => {

                if (!downloading) {
                    let sel = e.detail;
                    Overlay.downloadSelection(series, sel).then(ui => {
                        downloadChapter(sel, ui);
                    });
                }

            });
        });




        menu.addItem('Download Manga', () => {
            
            if(! downloading){
                Overlay.getSelection(series);
            }


        });
    }





})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, typeof self !== 'undefined' ? self : this);

