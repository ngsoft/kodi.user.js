const {uniqid, isPlainObject, JSON} = utils;


let
        globalStorage = {};

class DataStore {

    constructor(){
        this._listeners = {};
        this._elem = document.createElement('div');

    }


    onValueChange(name, listener){
        if (isString(name) && isFunction(listener)) {

            this._listeners[name] = this._listeners[name] || [];
            this._listeners[name].push({
                name: name,
                listener: listener
            });

            this._elem.addEventListener('valuechange', listener);

        }
        return this;
    }

    offValueChange(name, listener){

        if (isString(name) && this._listeners[name]) {
            this._listeners[name] = this._listeners[name].filter(item => {
                if (listener === item.listener || listener === undef) {
                    this._elem.removeEventListener('valuechange', item.listener);
                    return false;
                }
                return true;
            });

        }
        return this;
    }

    set(name, value){
        return new Promise(rsl => {

            if (!isString(name)) {
                throw new Error('Invalid name: not a string');
            }

            if (value === undef) {
                throw new Error('Invalid value: undefined');
            }

            if (this._listeners[name]) {
                this._elem.dispatchEvent(Object.assign(new Event('valuechange', {bubbles: false, cancelable: true}), {
                    detail: {
                        name: name,
                        value: value,
                        remote: false
                    }
                }));
            }
            rsl();
        });
    }



    multiset(obj){
        return new Promise(rsl => {
            if (!isPlainObject(obj)) {
                throw new Error('Invalid argument: obj');
            }

            let keys = Object.keys(obj), plist = [];
            for (let i = 0; i < keys.length; i++) {
                let name = keys[i], value = obj[name];
                plist.push(this.set(name, value));
            }
            if (plist.length === 0) rsl();
            else Promise.all(plist).then(() => rsl());
        });

    }


    remove(name){
        return this.set(name, null);
    }
}




class xStorage extends DataStore {

    constructor(store){

        super();
        store = store || sessionStorage;
        if (!(store instanceof Storage)) {
            throw new Error('Invalid store: not instance of Storage');
        }
        this.storage = store;
        this.storeKey = gmtools.info.script.uuid + ':';
    }

    get(name, defaultValue = null){

        return new Promise(rsl => {
            if (!isString(name)) {
                throw new Error('Invalid name: not a string');
            }

            name = this.storeKey + name;

            let value = this.storage.getItem(name);
            value = value === null ? defaultValue : value;
            if (isString(value) && value !== defaultValue) {
                value = JSON.parse(value);
            }
            rsl(value);
        });

    }

    set(name, value){

        if (isPlainObject(name)) {
            return this.multiset(name);
        }


        return new Promise(rsl => {
            super.set(name, value)
                    .then(() => {
                        if (value === null) this.storage.removeItem(this.storeKey + name);
                        else this.storage.setItem(this.storeKey + name, JSON.stringify(value));
                        rsl();
                    });
        });


    }



    has(name){
        return this.get(name).then(value => value !== undef);
    }


    clear(){
        return new Promise(rsl => {
            let name, i, keys = [];
            for (i = 0; i < this.storage.length; i++) {
                name = this.storage.key(i);
                if (name.indexOf(this.storeKey) === 0) {
                    keys.push(name);
                }
            }
            keys.forEach(name => this.storage.removeItem(name));
            console.debug(keys);
            rsl();
        });
    }

}



class GM_Storage extends DataStore {

    constructor(){
        super();
        this._gmSupport = gmtools.supports('GM_removeValueChangeListener', 'GM_addValueChangeListener');
    }


    get(name, defaultValue){

        return new Promise(rsl => {
            if (!isString(name)) {
                throw new Error('Invalid name: not a string');
            }
            let value = gmtools.getValue(name, defaultValue);
            if (isString(value) && value !== defaultValue) {
                value = JSON.parse(value);
            }
            rsl(value);
        });

    }

    set(name, value){
        if (isPlainObject(name)) {
            return this.multiset(name);
        }

        return super.set(name, value).then(() => {
            if (value === null) {
                gmtools.deleteValue(name);
            } else gmtools.setValue(name, JSON.stringify(value));
        });
    }



    has(name){
        return this.get(name).then(value => value !== undef);
    }

    clear(){
        return new Promise(rsl => {
            gmtools.listValues().forEach(name => {
                gmtools.deleteValue(name);
            });
            rsl();
        });
    }


    onValueChange(name, listener){

        if (!this._gmSupport) return super.onValueChange(name, listener);

        if (isString(name) && isFunction(listener)) {

            let handler = e => {
                e.detail.value = JSON.parse(e.detail.value);
                listener(e);
            };

            this._listeners[name] = this._listeners[name] || [];
            this._listeners[name].push({name: name, listener: listener, handler: handler});
            gmtools.onValueChange(name, handler);
        }
        return this;
    }

    offValueChange(name, listener){
        if (!this._gmSupport) return super.offValueChange(name, listener);

        if (this._listeners[name]) {
            this._listeners[name] = this._listeners[name].filter(item => {
                if (listener === item.listener || listener === undef) {
                    gmtools.offValueChange(name, item.handler);
                    return false;
                }
                return true;
            });
        }
        return this;
    }


}


class MemoryStorage extends DataStore {

    get storage(){
        return globalStorage[this.id];

    }

    constructor(id){
        super();
        this._gmSupport = false;
        this.id = isString(id) ? id : uniqid();
        globalStorage[this.id] = globalStorage[this.id] || {};

    }
    get(name, defaultValue){

        return new Promise(rsl => {
            if (!isString(name)) {
                throw new Error('Invalid name: not a string');
            }
            let value = this.storage[name];
            value = value === undef ? defaultValue : value;
            if (isString(value) && value !== defaultValue) {
                value = JSON.parse(value);
            }
            rsl(value);
        });

    }

    set(name, value){
        if (isPlainObject(name)) {
            return this.multiset(name);
        }

        return super.set(name, value)
                .then(() => {
                    if (value === null) delete this.storage[name];
                    else this.storage[name] = JSON.stringify(value);
                });
    }



    has(name){
        return this.get(name).then(value => value !== undef);
    }

    clear(){
        return new Promise(rsl => {
            globalStorage[this.id] = {};
            rsl();
        });
    }
}

Object.assign(exports, {
    MemoryStorage,
    GM_Storage: new GM_Storage(),
    xsessionStorage: new xStorage(),
    xlocalStorage: new xStorage(localStorage)

});