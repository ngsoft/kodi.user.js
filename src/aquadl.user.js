/* globals self, unsafeWindow */

(function(global, root, undef){

    const {menu} = root.gmtools;

    const {PDFDocument} = PDFLib;

    const {Overlay, ProgressBar} = root.asuraui;
    const {Manga, Chapter, handleFetchError} = root.mangas;
    const {html2doc, createElement, uniqid} = utils;
    const {ConcurrentPromiseQueue} = root.cpromise;

    const fetch = root['tamper-fetch'].fetch_timeout;


    let currentChapter = null, downloading = false, dlgif = false, series, isChapter = false;


    function getImageList(doc){
        let images = [  ...doc.querySelectorAll('.read-container .wp-manga-chapter-img')     ]
                .map(img => img.dataset.src ?? img.src).map(src => src.trim());

        console.debug(images);

        return images.filter(src => (! src.endsWith('.gif') || dlgif));
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


    history.pushState = (function(){


        const {pushState} = history;

        return function(state, title, url){

            dispatchEvent(Object.assign(new Event('page.pushstate'), {
                data: {
                    state,
                    title,
                    url
                }
            }));

            //console.debug('pushstate');
            return pushState.call(history, state, title, url);
        };


    })();







    function downloadChapter(selection, ui, qlength = 4, chaptersPerZip = 20){


        return new Promise((resolve, reject) => {

            let
                    tot = selection.length,
                    mainprogressbar = ui.progressbar,
                    root = mainprogressbar.elements.root,
                    current = 0,
                    success = [],
                    failed = [],
                    series = getSeries();


            mainprogressbar.label = 'Download Queue';

            mainprogressbar.total = tot;


            if (tot > 0)
            {
                downloading = true;
            } else
            {
                return reject(new Error('selection is empty'));
            }



            function endDownload(){

                mainprogressbar.label = 'Download complete'
                downloading = false;
                resolve({success: success, failed: failed});
            }




            const queue = new ConcurrentPromiseQueue({maxNumberOfConcurrentPromises: qlength});

            const maincontroller = new AbortController(), mainsignal = maincontroller.signal;
            mainprogressbar.one('progress.aborted', () => maincontroller.abort());


            let numParts = parseInt(Math.ceil(tot / chaptersPerZip));


            mainprogressbar.total = tot;


            if (selection.zip)
            {
                mainprogressbar.total += numParts;
            }

            for (let i = 0; i < numParts; i ++)
            {


                let num = i + 1, filename = series.title.trim(), zip, folder, lst = [];


                if (numParts > 1)
                {
                    filename += '.part' + num;
                }


                if (selection.zip)
                {
                    zip = new JSZip();
                    folder = zip.folder(series.title.trim());
                }



                selection.slice(i * chaptersPerZip, (i * chaptersPerZip) + chaptersPerZip).forEach(chapter => {


                    lst.push(queue.addPromise(() => {

                        const
                                progress = new ProgressBar(root, chapter.label + '.pdf', false),
                                controller = new AbortController();



                        if (mainsignal.aborted)
                        {

                            return Promise.reject(new Error('download aborted'));


                        } else
                        {
                            mainsignal.addEventListener('abort', () => controller.abort());

                        }


                        const signal = controller.signal;


                        root.insertBefore(progress.elements.container, mainprogressbar.elements.container.nextElementSibling);


                        progress.one('progress.complete', e => {
                            setTimeout(() => {
                                e.detail.remove();
                            }, 1000);

                        }).one('progress.aborted', () => {
                            controller.abort();
                        });

                        return chapter.getPDF(progress, signal, 20).then(pdf => {
                            if (folder)
                            {
                                folder.file(chapter.label + '.pdf', pdf, {base64: true});
                            } else
                            {
                                downloadFile(pdf, chapter.label, 'pdf');
                            }


                            mainprogressbar.current ++;
                            success.push(chapter);

                        }).catch(err => {
                            console.error(err);
                            progress.fail();
                            failed.push(chapter);
                        }).finally(() => {
                            current ++;
                        });
                    }));



                });

                Promise.allSettled(lst).then(() => {

                    if (zip)
                    {
                        if (mainprogressbar.aborted || Object.keys(zip.files).length < 2)
                        {
                            mainprogressbar.trigger('progress.fail', failed);
                            return endDownload();
                        }

                        mainprogressbar.label = 'Creating: ' + filename + '.zip';



                        zip.generateAsync({type: "blob"}).then(function(content){
                            downloadFile(content, filename, "zip");
                            mainprogressbar.current ++;
                        }).catch(error => {
                            console.error(error);
                        }).finally(() => {

                            mainprogressbar.label = 'Download Queue';

                            if (current === tot)
                            {
                                if (failed.length > 0)
                                {
                                    mainprogressbar.trigger('progress.fail', failed);
                                }
                                endDownload();
                            }

                        });
                    } else if (current === tot)
                    {
                        if (failed.length > 0)
                        {
                            mainprogressbar.trigger('progress.fail', failed);
                        }
                        endDownload();
                    }



                });

            }

        });
    }



    function aquaManga(){


        if (! series)
        {
            let title = document.querySelector('.container h1, center p a[href*="/read/"]').innerText.trim(), chapters = [];

            if (! isChapter)
            {
                document.querySelectorAll('.page-content-listing .wp-manga-chapter a').forEach(el => {
                    let label = el.innerText, link = el.href;
                    if(label.length>0){
                        chapters.push(new Chapter(link, label, getImageList));
                    }

                });

            } else
            {

                document.querySelectorAll('select.single-chapter-select option').forEach(opt => {

                    let label = opt.innerText.trim(), link = opt.dataset.redirect, chap = new Chapter(link, label, getImageList);

                    chapters.push(chap);

                    if (opt.selected)
                    {
                        currentChapter = chap;
                    }

                });

            }


            series = new Manga(title, chapters.reverse());

            //console.debug(series, chapters, currentChapter, isChapter);
        }



        return series;
    }



    function manhuaus(){


        if (! series)
        {
            let title = document.querySelector('.container h1, .breadcrumb a[href*="/manga/"]').innerText.trim(), chapters = [];

            if (! isChapter)
            {
                document.querySelectorAll('.page-content-listing .wp-manga-chapter a').forEach(el => {
                    let label = el.innerText, link = el.href;
                    if (label.length > 0)
                    {
                        chapters.push(new Chapter(link, label, getImageList));
                    }

                });

            } else
            {

                document.querySelectorAll('select.single-chapter-select option').forEach(opt => {

                    let label = opt.innerText.trim(), link = opt.dataset.redirect, chap = new Chapter(link, label, getImageList);

                    chapters.push(chap);

                    if (opt.selected)
                    {
                        currentChapter = chap;
                    }

                });

            }


            series = new Manga(title, chapters.reverse());

        }



        return series;
    }



    function getSeries(){

        if (/aquamanga/.test(location.host))
        {
            return  aquaManga();
        }

        else if (/manhuaus/.test(location.host))
        {
            return manhuaus();
        }

    }




    function main(){


        isChapter = /\/chapter/.test(location.pathname);

        currentChapter = series =  null;

        menu.clear();
        Overlay.instances = {};


        if (isChapter)
        {
            menu.addItem('Download current chapter', () => {
                if (! downloading)
                {
                    Overlay.downloadSelection(getSeries(), currentChapter).then(ui => {
                        downloadChapter([currentChapter], ui);
                    });
                    menu.removeItem('chapdl');
                }

            }, 'chapdl');



        }


        Overlay.getInstance(getSeries()).hide().then(ui => {
            ui.on('chapter.selected', e => {

                if (! downloading)
                {
                    let sel = e.detail;
                    Overlay.downloadSelection(getSeries(), sel).then(ui => {
                        downloadChapter(sel, ui);
                    });
                }

            });
        });




        menu.addItem('Download current manga', () => {

            if (! downloading)
            {
                Overlay.getSelection(getSeries());
            }


        }, 'mangadl');

    }


    addEventListener('page.pushstate', e => {

        console.debug(e);

        main();
        // setTimeout(main, 1500);

    });

    main();


})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, typeof self !== 'undefined' ? self : this);

