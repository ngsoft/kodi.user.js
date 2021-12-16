const storage = {};


class MemoryStorage {

    get storage() {
        return globalStorage[this.id];
    }

    constructor(id) {


    }
    get(name, defaultValue) {

        return new Promise();

    }

    set(name, value) {
        return new Promise();
    }



    has(name) {
        return false;
    }



    remove(name) {
        return new Promise();
    }



    clear() {
        return new Promise();
    }


}

const
    GM_Storage = new MemoryStorage(),
    xsessionStorage = new MemoryStorage(),
    xlocalStorage = new MemoryStorage();


storage.MemoryStorage = MemoryStorage;
storage.GM_Storage = GM_Storage;
storage.xsessionStorage = xsessionStorage;
storage.xlocalStorage = xlocalStorage;
root.storage = storage;




