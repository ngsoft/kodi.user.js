/** mangas.js */
(function(root, factory){
    /* globals define, require, module, self, exports */
    let name = 'mangas', deps = ['utils', 'gmfetch'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        factory(root[name] = {}, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function(exports, utils, gmfetch){

    const {fetch} = gmfetch;
    const {html2doc} = utils;

    const {PDFDocument} = PDFLib;

    function handleFetchError(response){

        if (!response.ok) {
            throw "response is not ok";
        }

        return response;
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



            let pdfDoc = await PDFDocument.create(), images = await this.getImages(), imagesData = [], idata, errorHappened = false, image;
            for (let i = 0; i < images.length; i++) {

                try {
                    idata = await fetch(images[i], {referrer: this.url, mode: 'cors'})
                            .then(handleFetchError)
                            .then(response => response.arrayBuffer())
                            .catch(err => {
                                errorHappened = true;
                            });

                } catch (error) {
                    
                    errorHappened = true;
                }

                if (errorHappened) {
                    break;
                }

                imagesData.push(idata);



            }


            if (errorHappened) {
                throw new Error('Cannot download ' + this.label);
            }


            for (let i = 0; i < imagesData.length; i++) {


                let buffer = new Uint8Array(imagesData[i]);


                try {
                    image = await pdfDoc.embedJpg(buffer);
                } catch (error) {

                    console.debug(error);

                    try {
                        image = await pdfDoc.embedPng(buffer);
                    } catch (error) {
                        console.debug(error);
                        continue;
                    }


                }
                let page = pdfDoc.addPage();
                page.setWidth(image.width);
                page.setHeight(image.height);
                // Draw the image
                page.drawImage(image);




            }

            return await pdfDoc.save();


            /*let pdfDoc = await PDFDocument.create(), images = await this.getImages(), idata, url, errorHappened = false, image;

            console.debug(images);

            for (let i = 0; i < images.length; i++) {

                try {


                    console.debug(i, images[i]);
                    idata = await fetch(images[i], {referrer: this.url, mode: 'cors'})
                            .then(handleFetchError)
                            .then(response => response.arrayBuffer())
                            .catch(err => {
                                errorHappened = true;
                            });

                } catch (error) {

                    console.debug(error);
                    errorHappened = true;
                }

                if (errorHappened) {
                    break;
                }




                    try {
                        idata = await toJpeg(idata);

                        console.debug(idata);
                    } catch (error) {

                        console.debug('image is not valid', error);
                        errorHappened = true;
                        break;
                    }


                try {
                    image = await pdfDoc.embedJpg(idata);
                } catch (error) {

                    console.debug(error);
                    
                    try {
                        image = await pdfDoc.embedPng(idata);
                    } catch (error) {
                        console.debug(error);
                        errorHappened = true;
                        break;
                    }


                }
                let page = pdfDoc.addPage();
                page.setWidth(image.width);
                page.setHeight(image.height);
                // Draw the image
                page.drawImage(image);




            }
            if (errorHappened) {
                throw new Error('Cannot download ' + this.label);
            }

            let result = await pdfDoc.save();

            console.debug(result);
            return result;*/

        }




        constructor(url, label, getImgFn){

            this.data = {url, label, images: []};
            this.getImgList = getImgFn;


        }

    }



    function isJpeg(arrayBuffer){
        let data = new Uint8Array(arrayBuffer), jpgMgck = [0xff, 0xd8];
        if (data[0] === jpgMgck[0] && data[1] === jpgMgck[1]) {
            return true;
        }

        return false;
    }


    function isPNG(arrayBuffer){
        let data = new Uint8Array(arrayBuffer), pngMgck = [0x89, 0x50];
        if (data[0] === pngMgck[0] && data[1] === pngMgck[1]) {
            return true;
        }

        return false;
    }

    function toJpeg(arrayBuffer){
        return new Promise((resolve) => {
            let
                    arrayBufferView = new Uint8Array(arrayBuffer),
                    blob = new Blob([arrayBufferView], {type: "image/jpeg"}),
                    urlCreator = window.URL || window.webkitURL,
                    imageUrl = urlCreator.createObjectURL(blob), image = new Image();
            image.addEventListener("load", () => {

                console.debug('image loaded');
                let canvas = document.createElement("canvas");
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                canvas.getContext("2d").drawImage(image, 0, 0);
                let data = canvas.toDataURL("image/jpeg");
                resolve(data);
            });

            image.src = imageUrl;

        });
    }




    Object.assign(exports, {
        Manga, Chapter
    });



}));