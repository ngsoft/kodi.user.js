/** mangas.js */
(function(root, factory){
    /* globals define, require, module, self, exports */
    let name = 'mangas', deps = ['utils'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        factory(root[name] = {}, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function(exports, utils){


    const {html2doc} = utils;

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

                    fetch(t.url, {
                        referrer: t.url
                    })
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