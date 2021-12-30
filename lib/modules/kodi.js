/** kodi.js */
(function (root, factory) {
    /* globals define, require, module, self, exports, URLSearchParams */
    let name = 'kodi', deps = ['utils', 'jsonrpc', 'storage'];
    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else {
        factory(root[name] = {}, ...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function (exports, utils, jsonrpc, storage) {


    const { isString, isInt, isFunction, intVal, isEmpty, isPlainObject, uniqid } = utils;
    const { Client } = jsonrpc;
    const { GM_Storage } = storage;




    function notEmptystring(v) {
        return isString(v) && !isEmpty(v);
    }



    class Server {
        constructor(data) {
            this._params = {
                name: 'LOCALHOST',
                host: "127.0.0.1",
                port: 8080,
                pathname: '/jsonrpc',
                user: null,
                auth: null,
                id: uniqid(),
                enabled: true,
                secure: false
            };
            if (isPlainObject(data)) Object.assign(this._params, data);
        }

        _set(key, value) {
            this._params[key] = value;
            this._rpc = null;
        }



        set enabled(enabled) {
            this._set('enabled', enabled === true);
        }

        set secure(secure) {
            this._set('secure', secure === true);
        }

        set name(name) {
            if (notEmptystring(name)) this._set('name', name);
        }

        set host(host) {
            if (notEmptystring(host)) this._set('host', host);
        }

        set pathname(pathname) {
            if (notEmptystring(pathname) && /^\//.test(pathname)) this._set('pathname', pathname);
        }

        set port(port) {
            port = intVal(port);
            if (!isInt(port)) return;
            if ((port > 0) && (port < 65536)) {
                this._set('port', port);
            }
        }

        get enabled() {
            return this._params.enabled === true;
        }

        get secure() {
            return this._params.secure;
        }

        get name() {
            return this._params.name;
        }

        get host() {
            return this._params.host;
        }

        get pathname() {
            return this._params.pathname;
        }

        get user() {
            return this._params.user;
        }

        get port() {
            return this._params.port;
        }

        get id() {
            return this._params.id;
        }

        get address() {
            let url = this.secure ? 'https://' : 'http://';
            url += this.host + ':' + this.port + this.pathname;
            return new URL(url);
        }

        get headers() {
            let result = {};
            if (notEmptystring(this._params.auth)) result.Authorization = 'Basic ' + this._params.auth;
            return result;
        }

        get player() {
            if (!this._player) {
                this._player = new Player(this);
            }
            return this._player;
        }

        setCredentials(user, password) {
            if (notEmptystring(user) && notEmptystring(password)) {
                this._set('user', user);
                this._set('auth', btoa(user + ':' + password));
            } else this._params.user = this._params.auth = this._rpc = null;
        }

        send(method, params = null) {
            this._rpc = this._rpc || new Client(this.address, this.headers);
            return this._rpc.send(method, params);
        }

        playVideo(link, onSuccess, onError) {
            onSuccess = isFunction(onSuccess) ? onSuccess : function () { };
            onError = isFunction(onError) ? onError : function () { };
            this.player
                .playVideo(link)
                .then(() => onSuccess())
                .catch(() => onError());
        }

        ping() {
            return this.player.ping();
        }

        save() {
            return GM_Storage.set(this.id, this._params);
        }

        remove() {
            return GM_Storage.remove(this.id);
        }

        static load(id) {
            return GM_Storage.get(id).then(params => {
                if (!params) {
                    throw new Error('Cannot load server ' + id);
                }
                return new Server(params);
            });
        }



    }

    exports.Server = Server;

    /**
     * Using API V10 cause using Leia at the moment
     * @link https://kodi.wiki/view/JSON-RPC_API/v10#Addons.GetAddons
     */
    class Player {
        constructor(server) {
            if (!(server instanceof Server)) {
                throw new Error('Invalid Server.');
            }
            this.server = server;
        }
        /**
         *
         * @param {string} method
         * @param {Object|Array|null} params
         * @returns {Promise}
         */
        send(method, params = null) {
            return this.server.send(method, params).then(resp => {
                return resp.result;
            });
        }

        clearPlaylist() {
            return this.send("Playlist.Clear", {
                playlistid: 1
            });
        }

        addToPlaylist(file) {

            return this.send("Playlist.Add", {
                playlistid: 1,
                item: {
                    file: file
                }
            });
        }

        playFromPlaylist(position = 0) {
            return this.send("Player.Open", {
                item: {
                    playlistid: 1,
                    position: position
                }
            });
        }

        getActivePlayers() {
            return this.send("Player.GetActivePlayers");
        }

        executeAddon(id, params = null, pathname = '/') {

            if (notEmptystring(params)) {
                pathname = params;
                params = null;
            }
            pathname = notEmptystring(pathname) ? pathname : '/';
            params = isPlainObject(params) ? params : {};
            let queryString, sp = new URLSearchParams();
            Object.keys(params).forEach(key => {
                sp.set(key, params[key]);
            });
            queryString = sp.toString();
            if (queryString.length > 0) pathname += "?" + queryString;

            return this
                .hasAddonEnabled(id)
                .then(result => {
                    if (result === true) {
                        return this.send("Addons.ExecuteAddon", {
                            wait: false,
                            addonid: id,
                            params: pathname
                        }).then(result => result === 'OK');

                    }
                    return false;
                });
        }

        getAddonVersion(id) {

            return this.getAddonDetails(id).then(result => {
                if (result === null) return null;
                return result.version;
            });
        }

        hasAddonEnabled(id) {
            return this
                .getAddonDetails(id)
                .then(addons => {
                    if (addons === null) return false;
                    return addons.enabled;

                });
        }

        getAddonDetails(id) {
            return new Promise(resolve => {

                if (!notEmptystring(id)) {
                    throw new Error('Invalid addon id');
                }
                this
                    .getAddons()
                    .then(addons => {

                        if (addons.some(item => item.addonid === id)) {
                            return this.send("Addons.GetAddonDetails", {
                                addonid: id,
                                properties: [
                                    "name",
                                    "version",
                                    "summary",
                                    "description",
                                    "path",
                                    "author",
                                    "dependencies",
                                    "enabled",
                                    "installed"
                                ]
                            }).then(result => result.addon);
                        }
                        return null;

                    })
                    .then(result => resolve(result));
            });


        }

        getAddons() {
            return this.send("Addons.GetAddons").then(result => {
                return result.addons;
            });
        }

        queue(file) {



            return new Promise((resolve, reject) => {

                file = file instanceof URL ? file.href : file;

                if (!notEmptystring(file)) {
                    reject(new Error('Invalid file'));
                    return;
                }

                this.addToPlaylist(file)
                    .then(result => {

                        if (result === 'OK') {
                            return this.getActivePlayers();
                        }
                        return reject();

                    })
                    .then(result => {

                        // check if no video is playing and start the first video in queue
                        if (result.length < 1) {
                            return this.playFromPlaylist();
                        }
                        return result;

                    })
                    .then(result => resolve(result))
                    .catch(err => reject(err));

            });

        }

        ping() {
            return new Promise(resolve => {
                this
                    .send("JSONRPC.Ping")
                    .then(result => resolve(result === 'pong'))
                    .catch(err => resolve(false));
            });
        }

        queueVideo(file) {
            return this.getActivePlayers()
                .then(result => {
                    if (result.length < 1) {
                        return this.clearPlaylist();
                    }
                    return result;
                }).then(() => this.queue(file));
        }

        directPlay(file) {

            return new Promise((resolve, reject) => {
                file = file instanceof URL ? file.href : file;

                if (!notEmptystring(file)) {
                    reject(new Error('Invalid file'));
                    return;
                }
                this.send("Player.Open", {
                    item: {
                        file: file
                    }
                })
                    .then(result => resolve(result))
                    .catch(err => reject(err));
            });
        }

        playVideo(file) {
            return this
                .getActivePlayers()
                .then(result => {
                    if (result.length < 1) {
                        return this.directPlay(file);
                    }
                    return this.queue(file);
                });
        }



    }

    exports.Player = Player;



    async function getServers() {

        let servers = await GM_Storage.get('servers', []), result = [], missing = [];

        for (let i = 0; i < servers.length; i++) {
            let id = servers[i], server;
            try {
                server = await Server.load(id);
                result.push(server);
            } catch (err) {
                missing.push(id);
                continue;
            }
        }

        if (missing.length > 0) {
            servers = servers.filter(id => !missing.includes(id));
            await GM_Storage.set('servers', servers);
        }

        if (servers.length === 0) {
            let server = new Server();
            await saveServer(server);
            return [server];
        }
        return result;
    }


    exports.getServers = getServers;



    async function saveServer(server) {

        if (!(server instanceof Server)) {
            throw new Error('Invalid server');
        }

        let
            id = server.id,
            servers = await GM_Storage.get('servers', []);

        if (!servers.includes(id)) {
            servers.push(id);
            await GM_Storage.set('servers', servers);
        }

        await server.save();
        return server;
    }



    exports.saveServer = saveServer;


    async function removeServer(id) {
        if (notEmptystring(id)) {
            await GM_Storage.remove(id);
        }

        return await getServers();

    }

    exports.removeServer = removeServer;


    async function createServer() {

        await saveServer(new Server());
        return await getServers();
    }


    exports.createServer = createServer;




}));