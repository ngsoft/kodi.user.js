/** storage.js */
(function (root, factory) {
    /* globals define, require, module, self, exports */
    let name = 'storage', deps = ['gmtools'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        let exports = root[name] = {};
        factory(exports, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function (exports, gmtools, undef) {

    /**
     * Generate a unique ID
     * @returns {String}
     */
    function uniqid() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }


    let {JSON} = gmtools.window;

    let
            globalStorage = {};


    class DataStore {



        constructor() {
            this._listeners = {};
            this._elem = document.createElement('div');

        }


        onValueChange(name, listener) {
            if (typeof name === "string" && typeof listener === "function") {

                this._listeners[name] = this._listeners[name] || [];
                this._listeners[name].push({
                    name: name,
                    listener: listener
                });

                this._elem.addEventListener('valuechange', listener);

            }
            return this;
        }

        offValueChange(name, listener) {

            if (typeof name === "string" && this._listeners[name]) {
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


        get(name, defaultValue) {
            console.error('DataStore.get() Not implemented');
            return new Promise(rsl => {
                rsl(defaultValue);
            });
        }


        set(name, value) {
            return new Promise(rsl => {
                if (this._listeners[name]) {
                    this._elem.dispatchEvent(Object.assign(new Event('valuechange', { bubbles: false, cancelable: true }), {
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
    }




    class xStorage extends DataStore {


        constructor(store) {

            super();
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
            this.storage.setItem(this.storeKey + name, JSON.stringify(value));
            return super.set(name, value);
        }



        has(name) {
            return this.get(name).then(value => value !== undef);
        }



        remove(name) {
            return new Promise(rsl => {
                if (typeof name !== 'string') {
                    throw new Error('Invalid name: not a string');
                }
                this.storage.removeItem(this.storeKey + name);
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












    class GM_Storage extends DataStore {


        constructor() {
            super();
            this._gmSupport = gmtools.supports('GM_removeValueChangeListener', 'GM_addValueChangeListener');


        }


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

            gmtools.setValue(name, JSON.stringify(value));
            return super.set(name, value);

        }



        has(name) {
            return this.get(name).then(value => value !== undef);
        }



        remove(name) {
            return new Promise(rsl => {
                if (typeof name !== 'string') {
                    throw new Error('Invalid name: not a string');
                }
                this.get(name).then(oldValue => {
                    gmtools.deleteValue(name);
                    this.triggerValueChange(name, oldValue);
                    rsl();
                });
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


        onValueChange(name, listener) {

            if (!this._gmSupport) return super.onValueChange(name, listener);

            if (typeof name === "string" && typeof listener === "function") {

                let handler = e => {
                    e.detail.value = JSON.parse(e.detail.value);
                    listener(e);
                };

                this._listeners[name] = this._listeners[name] || [];
                this._listeners[name].push({ name: name, listener: listener, handler: handler });
                gmtools.onValueChange(name, handler);
            }
            return this;
        }

        offValueChange(name, listener) {
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

        get storage() {
            return globalStorage[this.id];

        }

        constructor(id) {
            super();
            this._gmSupport = false;
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

                this.storage[name] = JSON.stringify(value);
                return super.set(name, value);
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
                this.get(name).then(oldValue => {
                    delete this.storage[name];
                    this.triggerValueChange(name, oldValue);
                    rsl();
                });
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

