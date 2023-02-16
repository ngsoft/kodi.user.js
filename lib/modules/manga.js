/** manga.js */
(function(root, factory){
    /* globals define, require, module, self, exports */
    let name = 'manga', deps = ['gmfetch'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        factory(root[name] = {}, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function(exports, gmfetch, undef){



    //const fetch = {gmfetch};

    class Manga {

        get title(){
            return this.data.title;
        }

        get description(){
            return this.data.description;
        }


        get chapters(){
            return this.data.chapters;
        }

        constructor(title, description, chapters){

            this.data = {title: title, description: description, chapters: chapters};

            if (!chapters) {
                this.data.chapters = [];
            }

        }
    }



    class Chapter {
        get url(){
            return this.data.url;
        }

        get images(){

        }

        get label(){
            return this.data.label;
        }

        get number(){
            return this.data.num;
        }

        constructor(url, label, current = false){

            this.data = {url, label, images: [], num: 0, current};
            let num = label.match(/[\d\.]+$/);

            if (num) {
                this.data.num = num[0];
            }

        }

    }




    class ChapterImage {

        static isJpeg(arrayBuffer){
            let data = new Uint8Array(arrayBuffer), jpgMgck = [0xff, 0xd8];
            if (data[0] === jpgMgck[0] && data[1] === jpgMgck[1]) {
                return true;
            }

            return false;
        }

        static isPNG(arrayBuffer){
            let data = new Uint8Array(arrayBuffer), pngMgck = [0x89, 0x50];
            if (data[0] === pngMgck[0] && data[1] === pngMgck[1]) {
                return true;
            }

            return false;
        }

        static toJpeg(arrayBuffer){
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

        get url(){

        }

        get index(){

        }

        get raw(){

        }

        get type(){

        }

        get size(){

        }
    }


    Object.assign(exports, {
        Manga, Chapter, ChapterImage
    });



}));