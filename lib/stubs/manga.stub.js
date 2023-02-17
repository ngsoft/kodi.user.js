class Manga {

    get title(){
        return '';
    }

    get description(){
        return '';
    }


    get chapters(){
        return [];
    }

    constructor(title, description, chapters){ }
}



class Chapter {

    get manga(){
        return new Manga();
    }
    get url(){
        return '';
    }

    get images(){

    }

    get label(){
        return '';
    }

    get number(){
        return '';
    }

    constructor(url, label, current = false){ }

}




class ChapterImage {

    static isJpeg(arrayBuffer){
        return false;
    }

    static isPNG(arrayBuffer){
        return false;
    }

    static toJpeg(arrayBuffer){
        return new Promise();
    }

    get chapter(){
        return new Chapter();
    }

    get url(){
        return '';
    }

    get index(){
        return 0;
    }

    async get raw(){
        return new ArrayBuffer();
    }

    async get type(){
        return '';
    }

    async get size(){
        return 0;
    }
}


const manga = {Manga, Chapter, ChapterImage}, root = {manga};