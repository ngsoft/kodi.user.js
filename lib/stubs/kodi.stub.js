


/**
 * API V10
 * 
 * @link https://kodi.wiki/view/JSON-RPC_API/v10#Addons.GetAddons
 * 
 * @param {Server} server 
 * @returns {Player}
 */
function Player(server) {
    return this;
}


Player.prototype = {
    /**
     * Send an RPC Request
     * @param {string} method 
     * @param {Object|Array|null} params 
     * @returns {Promise}
     */
    send: function (method, params = null) { return new Promise(); },
    /**
     *
     * @returns {Promise}
     */
    clearPlaylist: function () { return new Promise(); },
    /**
     *
     * @param {string|URL} file
     * @returns {Promise}
     */
    addToPlaylist: function (file) { return new Promise(); },
    /**
     *
     * @param {number} position
     * @returns {Promise}
     */
    playFromPlaylist: function (position = 0) { return new Promise(); },
    /**
     *
     * @returns {Promise}
     */
    getActivePlayers: function () { return new Promise(); },
    /**
     *
     * @param {string} id
     * @param {Object} [params]
     * @param {string} [pathname]
     * @returns {Promise}
     */
    executeAddon: function (id, params = null, pathname = '/') { return new Promise(); },
    /**
     *
     * @param {string} id
     * @returns {Promise}
     */
    getAddonVersion: function (id) { return new Promise(); },
    /**
     *
     * @param {string} id
     * @returns {Promise}
     */
    hasAddonEnabled: function (id) { return new Promise(); },
    /**
     *
     * @param {string} id
     * @returns {Promise}
     */
    getAddonDetails: function (id) { return new Promise(); },
    /**
     *
     * @returns {Promise}
     */
    getAddons: function () { return new Promise(); },
    /**
     *
     * @param {string|URL} file
     * @returns {Promise}
     */
    queue: function (file) { return new Promise(); },
    /**
     *
     * @returns {Promise}
     */
    ping: function () { return new Promise(); },
    /**
     *
     * @param {string|URL} file
     * @returns {Promise}
     */
    queueVideo: function (file) { return new Promise(); },
    /**
     *
     * @param {string|URL} file
     * @returns {Promise}
     */
    directPlay: function (file) { return new Promise(); },
    /**
     *
     * @param {string|URL} file
     * @returns {Promise}
     */
    playVideo: function (file) { return new Promise(); }


};








/**
 * Connect to a server
 * 
 * @param {Object} data 
 * @returns {Server}
 */
function Server(data) {
    return this;
}

Server.prototype = {
    name: 'LOCALHOST',
    host: "127.0.0.1",
    port: 8080,
    pathname: '/jsonrpc',
    user: null,
    id: '',
    enabled: true,
    secure: false,
    headers: {},
    player: new Player(),
    address: new URL('http://127.0.0.1:8080/jsonrpc'),
    /**
     * Set Credentials for connection
     * @param {string|null} user 
     * @param {string|null} password 
     */
    setCredentials: function (user, password) { },
    /**
     * Send an RPC Request
     * 
     * @param {string} method 
     * @param {Object|Array} [params]
     * @returns {Promise}
     */
    send(method, params = null) { return new Promise(); },
    /**
     * 
     * @param {string|URL} link 
     * @param {function} [onSuccess]
     * @param {function} [onError]
     */
    playVideo: function (link, onSuccess, onError) { },
    /**
     * Ping the server
     * @returns {Promise} Promise that resolves a Boolean
     */
    ping: function () { return new Promise(); },

    /**
     * Save the server
     * @returns {Promise}
     */
    save: function () { return new Promise(); }




};

/**
 * Loads a Server
 * @param {string} id 
 * @returns {Promise} Promise that resolves a Server
 */
Server.load = function (id) { return new Promise(); };

/**
 * Get Server List
 * @returns {Promise} Resolves an array of servers
 */
function getServers() { return new Promise(); }

/**
 * Saves a server
 * @param {Server} server 
 * @returns {Promise}
 */
function saveServer(server){
    return new Promise();
}
/**
 * Removes a server
 * @param {string} id
 * @returns {Promise}
 */
function removeServer(id){
    return new Promise();
}

/**
 * Creates a server
 * @returns {Promise}
 */
function createServer(){
    return new Promise();
}



const kodi = {Player, Server, getServers, saveServer, removeServer, createServer};

root.kodi = kodi;