/** mangas.js */
(function(root, factory){
    /* globals define, require, module, self, exports */
    let name = 'mangas', deps = ['utils', 'gmfetch', 'gmtools'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        factory(root[name] = {}, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function(exports, utils, gmfetch, gmtools){

    const {fetch} = gmfetch;
    const {html2doc, createElement} = utils;
    const {xmlhttpRequest} = gmtools;
    const {PDFDocument} = PDFLib;


    function handleFetchError(response){

        if (!response.ok) {
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

        constructor(title, chapters){

            this.data = {title: title, chapters: chapters};

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

                    fetch(t.url, {referrer: t.url})
                            .then(handleFetchError)
                            .then(resp => resp.text())
                            .then(txt => html2doc(txt))
                            .then(doc => {
                                resolve(t.data.images = getImgFn(doc));
                            })
                            .catch(reject);

                }else{
                    resolve(this.data.images);
                }

            });
        }

        async getPDF(){

            let images = await this.getImages(), pdfDoc = await PDFDocument.create(), hasError = false, bytes;

            if (images.length < 1) {
                throw new Error('Cannot download ' + this.label);
            }

            for (let i = 0; i < images.length; i++) {
                try {

                    bytes = await this.getImage(images[i]).catch(error => {
                        console.error(error);
                        hasError = true;
                    });

                } catch (error) {
                    console.error(error);
                    hasError = true;
                }
                if (hasError) {
                    break;
                }

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

            return await pdfDoc.save();


        }


        getImage(url){

            return new Promise((resolve, reject) => {

                xmlhttpRequest({
                    url: url,
                    method: "GET",
                    responseType: "blob",
                    headers: {
                        'Content-Type': 'image/jpeg,image/png',
                        'Referrer': this.url
                    },
                    onload: (e) => {

                        if (e.statusText !== 'OK') {
                            throw new Error("response is not ok");
                        }
                        var fileReader = new FileReader();
                        fileReader.onload = () => {
                            resolve(fileReader.result);
                        };
                        fileReader.readAsArrayBuffer(e.response);

                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        }








        constructor(url, label, getImgFn){

            this.data = {url, label, images: []};
            this.getImgList = getImgFn;


        }

    }








    Object.assign(exports, {
        Manga, Chapter
    });



}));