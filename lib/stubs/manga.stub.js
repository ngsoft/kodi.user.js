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

    get url(){
        return '';
    }

    get index(){
        return 0;
    }

    get raw(){
        return new Promise();
    }

    get type(){
        return '';
    }

    get size(){
        return 0;
    }
}


const manga = {Manga, Chapter, ChapterImage}, root = {manga};