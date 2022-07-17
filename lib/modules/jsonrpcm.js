/** jsonrpcm.js */
(function (root, factory) {
    /* globals define, require, module, self, exports */
    let name = 'jsonrpcm', deps = ['utils', 'jsonrpc', 'emitter'];
    if (typeof define === 'function' && define.amd) {
        define(name, deps, factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        module.exports = factory(...deps.map(d => require(d)));
    } else {
        root[name] = factory(...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function (utils, jsonrpc, emitter, undef) {

    const { global, uniqid, isFunction } = utils;
    const { Request, Response, ResponseError, ErrorCodes, ErrorMessages } = jsonrpc;
    let
            isEmbed = global.top !== global.self,
        target = global.parent,
        origin = location.origin;


    function createRequest(connection, method, params) {

        let req = new Request(method, params);

        if (!(connection instanceof Connection))
            throw new TypeError('invalid connection');

        return {
            request: req,
            jsonrpcm: '1.0',
            connection: connection
        };

    }


    let Entity = (function () {



        //constructor
        function Entity(context) {

            if (!(this instanceof Entity)) return new Entity(context);

            context = context || global;

            if (!isFunction(context.postMessage)) {
                throw new TypeError('invalid context');
            }


            this.id = uniqid();
            this.context = context;
            this.target = target;
            this.origin = origin;
            // create mixin
            emitter(this);

            this.on('message', e => {

                if (e.detail && e.detail.jsonrpcm) {







                }



            });



        }

        // static methods
        Object.assign(Entity, {

        });

        //methods
        Entity.prototype = {

            connect: function (context) {
                context = context || target;
                let toEntity = new Entity(context);





            }

        };

        return Entity;

    }());


    let Connection = (function () {

        //constants + private methods
        const
            CONNECTION_CLOSE = 0,
            CONNECTION_OPEN = 1,
            CONNECTION_CONNECTED = 2,
            CONNECTION_DESTROYED = -1;







        function Connection(entity, destination) {
            if (!(this instanceof Connection))
                return new Connection(parent, child);
            if (!(entity instanceof Entity))
                throw new TypeError('Invalid entity, not an Entity');
            if (!(destination instanceof Entity))
                throw new TypeError('Invalid destination, not an Entity');

            this.entity = entity;
            this.destination = destination;
        }


        Connection.prototype = {

            get: async function () {


            }


        };




        return Connection;
    }());

















}));