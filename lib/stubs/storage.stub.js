const storage = {};


class DataStore {

    /**
     * Get an entry from the storage
     *
     * @param {string} name
     * @param {any} defaultValue
     * @returns {Promise}
     */
    get(name, defaultValue) {

        return new Promise();

    }

    /**
     * Adds a value to the storage
     *
     * @param {string} name
     * @param {any} value
     * @returns {Promise}
     */
    set(name, value) {
        return new Promise();
    }
    /**
     * Adds multiple values to the storage
     *
     * @param {Object} obj
     * @returns {Promise}
     */
    multiset(obj){
        return new Promise();
    }

    /**
     * Checks if key exists
     * @param {type} name
     * @returns {Promise} resolves Boolean
     */
    has(name) {
        return new Promise();
    }

    /**
     * Removes specific key from the storage
     *
     * @param {type} name
     * @returns {Promise}
     */

    remove(name) {
        return new Promise();
    }


    /**
     * Clears the storage
     * @returns {Promise}
     */
    clear() {
        return new Promise();
    }

    /**
     * Adds event listener for specific value
     * @param {string} name
     * @param {function} listener
     * @returns {DataStore}
     */
    onValueChange(name, listener){

        return this;
    }

    /**
     * Removes event listener for specific value
     * @param {string} name key to listen to
     * @param {function} [listener] listener to remove
     * @returns {DataStore}
     */
    offValueChange(name, listener){


        return this;
    }



}

const
        GM_Storage = new DataStore(),
        xsessionStorage = new DataStore(),
        xlocalStorage = new DataStore(),
        MemoryStorage = DataStore;


storage.MemoryStorage = new MemoryStorage();
storage.GM_Storage = GM_Storage;
storage.xsessionStorage = xsessionStorage;
storage.xlocalStorage = xlocalStorage;
root.storage = storage;




