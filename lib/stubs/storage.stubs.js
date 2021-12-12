const storage = {
    MemoryStorage: function(id){},
    GM_Storage: {},
    sessionStorage: {},
    localStorage: {}
};


storage.MemoryStorage.prototype = storage.GM_Storage = storage.sessionStorage = storage.localStorage = {

    /**
     * Gets a value from the storage
     * @param {string} name
     * @param {any} defaultValue
     * @returns {Promise}
     */
    get: function(name, defaultValue){

        return new Promise(() => {

            throw new Error('get() not implemented.');
        });
    },

    /**
     * Adds a value to the storage
     *
     * @param {string} name
     * @param {any} value
     * @returns {Promise}
     */
    set: function(name, value){
        return new Promise(() => {

            throw new Error('set() not implemented.');
        });
    },

    /**
     * Checks if storage has a value for the given key
     *
     * @param {string} key
     * @returns {Promise}
     */
    has: function(name){
        return new Promise(() => {

            throw new Error('has() not implemented.');
        });
    },

    /**
     * Remove a value from the storage
     * @param {string} name
     * @returns {Promise}
     */
    remove: function(name){
        return new Promise(() => {

            throw new Error('remove() not implemented.');
        });
    },


    /**
     * Empty the storage
     * @returns {Promise}
     */
    clear: function(){
        return new Promise(() => {

            throw new Error('clear() not implemented.');
        });
    }
};






