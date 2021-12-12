const storage = {};


class MemoryStorage {

    get storage(){
        return globalStorage[this.id];
    }

    constructor(id){

        this.id = typeof id === 'string' ? id : uniqid();
        globalStorage[this.id] = globalStorage[this.id] || {};

    }
    get(name, defaultValue){

        return new Promise(rsl => {
            if (typeof name !== 'string') {
                throw new Error('Invalid name: not a string');
            }
            let value = this.storage[name] || defaultValue;
            if (typeof value === 'string' && value !== defaultValue) {
                value = JSON.parse(value);
            }
            rsl(value);
        });

    }

    set(name, value){
        return new Promise(rsl => {
            if (typeof name !== 'string') {
                throw new Error('Invalid name: not a string');
            }

            if (value === undef) {
                throw new Error('Invalid value: undefined');
            }

            let json = JSON.stringify(value);
            this.storage[name] = json;
            rsl();
        });
    }



    has(name){
        return this.get(name).then(value => value !== undef);
    }



    remove(name){
        return new Promise(rsl => {
            if (typeof name !== 'string') {
                throw new Error('Invalid name: not a string');
            }
            delete this.storage[name];
            rsl();
        });
    }



    clear(){
        return new Promise(rsl => {
            globalStorage[this.id] = {};
            rsl();
        });
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




