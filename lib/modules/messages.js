/** messages.js */
(function(root, factory){
    /* globals define, require, module, self, exports */
    let name = 'messages', deps = ['utils', 'emitter'];
    if (typeof define === 'function' && define.amd) {
        define(name, deps, factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        module.exports = factory(...deps.map(d => require(d)));
    } else {
        root[name] = factory(...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function(utils, emitter, undef){


    const {global, uniqid, JSON, isString} = utils;
    let
            isEmbed = global.parent !== undef,
            target = global.parent || global,
            id = uniqid(),
            children = [];


    function sendMessage(type, detail){
        let target = isEmbed ? global.parent : global, data = {};
        detail = detail || {};
        if (isString(type)) {
            data.type = type;
            data.detail = detail;
            data = JSON.stringify(data);
            target.postMessage(data, '*');
        }
    }


    emitter.on('message', e => {
        e.preventDefault();
        let data;
        try {
            if (e.data) {
                data = JSON.parse(e.data);
                if (data.type && data.detail) {
                    data.detail.source = e.source;
                    emitter.trigger(data.type, data.detail);
                }
            }

        } catch (e) {
            console.error(e);
        }
    });





    if (!isEmbed) {
        emitter.on('handshake', e => {
            let detail = e.detail;

            if (detail) {
                if (!children.includes(detail.id) && detail.source) {
                    children.push(detail.id);
                    //answer
                    detail.source.postMessage({type: 'handshake', detail: {}}, '*')
                }

            }

        });
    }

}));