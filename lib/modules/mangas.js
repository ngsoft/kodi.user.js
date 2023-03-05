/** mangas.js */
(function(root, factory){
    /* globals define, require, module, self, exports */
    let name = 'mangas', deps = ['utils', 'tamper-fetch', 'gmtools'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        factory(root[name] = {}, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function(exports, utils, gmfetch, gmtools){

    const fetch = gmfetch.fetch_timeout;
    const {html2doc, createElement, isString} = utils;
    const {xmlhttpRequest} = gmtools;
    const {PDFDocument} = PDFLib;


    function handleFetchError(response){

        if (! response.ok)
        {
            console.error(response);
            throw new Error("response is not ok");
        }

        return response;
    }


    function isJPEG(arrayBuffer){
        let data = new Uint8Array(arrayBuffer);
        let jpgMgck = [0xff, 0xd8];
        if (data[0] === jpgMgck[0] && data[1] === jpgMgck[1]) {
            return true;
        }

        return false;
    }

    function isPNG(arrayBuffer){
        let data = new Uint8Array(arrayBuffer);
        let pngMgck = [0x89, 0x50];
        if (data[0] === pngMgck[0] && data[1] === pngMgck[1]) {
            return true;
        }

        return false;
    }





    class Manga {

        get title(){
            return this.data.title;
        }


        get chapters(){
            return this.data.chapters;
        }

        get beta(){
            return this.data.beta;
        }

        searchResult(){
            return new Promise((resolve, reject) => {

                if (!this.data.searchFn) {
                    return reject(new Error('no search function'));
                }

                if (!this.data.search) {

                    this.data.searchFn(this.title).then(result => {
                        resolve(this.data.search = result);
                    }).catch(reject);

                } else {
                    resolve(this.data.search);
                }


            });

        }

        constructor(title, chapters, beta = false, searchFn){

            this.data = {title: title, chapters: chapters, beta, searchFn};

            if (!chapters) {
                this.data.chapters = [];
        }

        }
    }



    class Chapter {

        get url(){
            return this.data.url;
        }


        get label(){
            return this.data.label;
        }



        getImages(){

            let getImgFn = this.getImgList, t = this;
            return new Promise((resolve, reject) => {

                if (t.data.images.length < 1) {

                    fetch(t.url, {referrer: location.origin + '/', referrerPolicy: "strict-origin-when-cross-origin"})
                            .then(handleFetchError)
                            .then(resp => resp.text())
                            .then(txt => html2doc(txt))
                            .then(doc => {
                                resolve(t.data.images = getImgFn(doc));
                            })
                            .catch(reject);

                } else {
                    resolve(this.data.images);
                }

            });
        }

        async createPDF(images, progress){

            let pdfDoc = await PDFDocument.create(), hasError = false;
            for (let i = 0; i < images.length; i++) {
                let bytes = images[i];
                if (!isJPEG(bytes) && !isPNG(bytes)) {
                    console.error('Invalid image format');
                    hasError = true;
                    break;
                }
                let image;
                try {
                    image = await pdfDoc.embedJpg(bytes);
                } catch (error) {
                    try {
                        image = await pdfDoc.embedPng(bytes);
                    } catch (error) {
                        console.error(error);
                        hasError = true;
                        break;
                    }
                }
                let page = pdfDoc.addPage();
                page.setWidth(image.width);
                page.setHeight(image.height);
                page.drawImage(image);


            }

            if (hasError) {
                throw new Error('Cannot download ' + this.label);
            }
            progress.current++;

            return this.data.pdf = await pdfDoc.save();


        }

        getPDF(progress, signal, timeout = 20){


            return new Promise((resolve, reject) => {
                progress = progress || {current: 0, total: 1};
                if (this.data.pdf) {
                    progress.current = progress.total;
                    resolve(this.data.pdf);
                    return;
                }
                this.getImages().then(images => {


                    if (images.length < 1) {
                        throw new Error('Cannot download ' + this.label);
                    }


                    progress.total = images.length + 1;

                    Promise.allSettled(images.map((url, index) => {
                        return new Promise((resolve, reject) => {

                            if (this.data.imagesData[index]) {
                                resolve(this.data.imagesData[index]);
                                return;
                            }
                            if (/soldier/.test(location.host) && index < 2)
                            {
                                resolve();
                                return;
                            }


                            fetch(url, {
                                referrer: location.origin + '/',
                                headers: {'Content-Type': 'image/jpeg,image/png'},
                                timeout, signal
                            })
                                    .then(handleFetchError)
                                    .then(resp => resp.arrayBuffer())
                                    .then(bytes => {
                                        progress.current++;
                                        resolve(this.data.imagesData[index] = bytes);
                                    })
                                    .catch(reject);
                        });
                    })).then(imgs => {
                        
                        imgs = imgs.map(img => {

                            if (img.error)
                            {
                                console.error(img.error);
                            }

                            return img.value;
                        }).filter(img => {

                            return img instanceof ArrayBuffer;
                        });
                        if (! /soldier/.test(location.host))
                        {
                            if (images.length !== imgs.length)
                            {
                                throw new Error('cannot download all images.');
                            }
                        } else
                        {
                            progress.current = progress.total - 1;
                        }

                        this.createPDF(imgs, progress).then(resolve).catch(reject);
                    }).catch(reject);

                });


            });
        }



        constructor(url, label, getImgFn){

            this.data = {url, label: label.trim(), images: [], imagesData: {}};
            this.getImgList = getImgFn;


        }

    }








    Object.assign(exports, {
        Manga, Chapter, handleFetchError
    });



}));