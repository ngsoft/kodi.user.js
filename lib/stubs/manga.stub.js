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


const manga = {Manga, Chapter, ChapterImage}, root = {manga};