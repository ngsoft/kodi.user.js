/** storage.js */
(function (root, factory) {
    /* globals define, require, module, self, exports */
    let name = 'storage', deps = ['gmtools'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        let result, exports = root[name] = {};
        result = factory(exports, ...deps.map(d => root[d]));
        if (typeof result !== 'undefined') root[name] = result;
    }

}(typeof self !== 'undefined' ? self : this, function (exports, gmtoolsd, undef) {

    const { JSON } = self;

    let globalStorage = {};


    /**
     * Test if given argument is a plain object
     * @param {any} v
     * @returns {Boolean}
     */
    function isPlainObject(v) {
        return v instanceof Object && Object.getPrototypeOf(v) === Object.prototype;
    }


    /**
     * Generate a unique ID
     * @returns {String}
     */
    function uniqid() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }





    class StorageInterface {

        /**
         * Gets a value from the storage
         * @param {string} name
         * @param {any} defaultValue
         * @returns {Promise}
         */
        get(name, defaultValue) {

            return new Promise(() => {

                throw new Error('get() not implemented.');
            });

        }

        /**
         * Adds a value to the storage
         *
         * @param {string} name
         * @param {any} value
         * @returns {Promise}
         */
        set(name, value) {
            return new Promise(() => {

                throw new Error('set() not implemented.');
            });
        }

        /**
         * Checks if storage has a value for the given key
         *
         * @param {string} key
         * @returns {Promise}
         */
        has(name) {
            return new Promise(() => {

                throw new Error('has() not implemented.');
            });
        }

        /**
         * Remove a value from the storage
         * @param {string} name
         * @returns {Promise}
         */
        remove(name) {
            return new Promise(() => {

                throw new Error('remove() not implemented.');
            });
        }


        /**
         * Empty the storage
         * @returns {Promise}
         */
        clear() {
            return new Promise(() => {

                throw new Error('clear() not implemented.');
            });
        }
    }




    class xStorage extends StorageInterface {


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
                this.storage.setItem(name, value);
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


    class GM_Storage extends StorageInterface {

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
                gmtools.setValue(name, value);
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


    class MemoryStorage extends StorageInterface {

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
                this.storage[name] = value;
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





    /**
     * DataStore
     */
    function DataStore(instance) {






    }








}));
