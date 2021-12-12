/** storage.js */
(function (root, factory) {
    /* globals define, require, module, self, exports */
    let name = 'storage', deps = ['gmtools', 'emitter'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        let exports = root[name] = {};
        factory(exports, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function (exports, gmtools, emit, undef) {

    /**
     * Generate a unique ID
     * @returns {String}
     */
    function uniqid() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }


    let { JSON } = self;

    let { emitter } = emit;

    let
        globalStorage = {},
        instance = gmtools.info.script.uuid + ':' + uniqid();




    class ValueChangeEmitter {



    }
    ValueChangeEmitter.gmSupport = false;

    if (
        Array.isArray(gmtools.metadata.grant) &&
        gmtools.metadata.grant.includes('GM_addValueChangeListener') &&
        gmtools.metadata.grant.includes('GM_removeValueChangeListener')
    ) {
        ValueChangeEmitter.gmSupport = true;
    }







    class xStorage {


        constructor(store) {

            store = store || sessionStorage;
            if (!(store instanceof Storage)) {
                throw new Error('Invalid store: not instance of Storage');
            }
            this.storage = store;
            this.storeKey = gmtools.info.script.uuid + ':';


        }

        get(name, defaultValue) {

            return new Promise(rsl => {
                if (typeof name !== 'string') {
                    throw new Error('Invalid name: not a string');
                }

                name = this.storeKey + name;

                let value = this.storage.getItem(name);
                value = value === null ? defaultValue : value;
                if (typeof value === 'string' && value !== defaultValue) {
                    value = JSON.parse(value);
                }
                rsl(value);
            });

        }

        set(name, value) {
            return new Promise(rsl => {
                if (typeof name !== 'string') {
                    throw new Error('Invalid name: not a string');
                }

                if (value === undef) {
                    throw new Error('Invalid value: undefined');
                }
                name = this.storeKey + name;
                let json = JSON.stringify(value);
                this.storage.setItem(name, json);
                rsl();
            });
        }



        has(name) {
            return this.get(name).then(value => value !== undef);
        }



        remove(name) {
            return new Promise(rsl => {
                if (typeof name !== 'string') {
                    throw new Error('Invalid name: not a string');
                }
                name = this.storeKey + name;
                this.storage.removeItem(name);
                rsl();
            });
        }



        clear() {
            return new Promise(rsl => {
                let name, i;
                for (i = 0; i < this.storage.length; i++) {
                    name = this.storage.key(i);
                    if (name.indexOf(this.storeKey) === 0) {
                        this.storage.removeItem(name);
                    }
                }
                rsl();
            });
        }


    }












    class GM_Storage {


        get(name, defaultValue) {

            return new Promise(rsl => {
                if (typeof name !== 'string') {
                    throw new Error('Invalid name: not a string');
                }
                let value = gmtools.getValue(name, defaultValue);
                if (typeof value === 'string' && value !== defaultValue) {
                    value = JSON.parse(value);
                }
                rsl(value);
            });

        }

        set(name, value) {
            return new Promise(rsl => {
                if (typeof name !== 'string') {
                    throw new Error('Invalid name: not a string');
                }

                if (value === undef) {
                    throw new Error('Invalid value: undefined');
                }

                let json = JSON.stringify(value);
                gmtools.setValue(name, json);
                rsl();
            });
        }



        has(name) {
            return this.get(name).then(value => value !== undef);
        }



        remove(name) {
            return new Promise(rsl => {
                if (typeof name !== 'string') {
                    throw new Error('Invalid name: not a string');
                }

                gmtools.deleteValue(name);
                rsl();
            });
        }



        clear() {
            return new Promise(rsl => {
                gmtools.listValues().forEach(name => {
                    gmtools.deleteValue(name);
                });
                rsl();
            });
        }


    }


    class MemoryStorage {

        get storage() {
            return globalStorage[this.id];
        }

        constructor(id) {

            this.id = typeof id === 'string' ? id : uniqid();
            globalStorage[this.id] = globalStorage[this.id] || {};

        }
        get(name, defaultValue) {

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

        set(name, value) {
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



        has(name) {
            return this.get(name).then(value => value !== undef);
        }



        remove(name) {
            return new Promise(rsl => {
                if (typeof name !== 'string') {
                    throw new Error('Invalid name: not a string');
                }
                delete this.storage[name];
                rsl();
            });
        }



        clear() {
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

}));

