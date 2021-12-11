/** gmtools.js */
(function(root, factory){
    let
            name = 'gmtools',
            deps = [];

    if (typeof define === 'function' && define.amd) {
        define(name, ['exports'].concat(deps), factory);
    } else if (typeof exports === 'object' && module.exports) {
        factory(exports, ...deps.map(d => require(d)));
    } else factory((root[name] = {}), ...deps.map(d => root[d]));

}(typeof self !== 'undefined' ? self : this, function(exports){

    let
            root = typeof self !== 'undefined' ? self : this,
            comments = root.GM_info.script.header,
            metadata = {},
            RE_BLOCK = /(?:[\/]{2,}\s*==UserScript==\n*)(.*)(?:[\/]{2,}\s*==\/UserScript==\n*)/s,
            RE_PROP = /[\/]{2,}[ \t]*@([\w\-]+)[ \t]*(.*)\n*/g,
            RE_KEY_VAL = /(\w+)\s+(.*)$/,
            KEY_VALUES = /^(resource|antifeature)/,
            ARRAY_TAGS = /^(include|match|exclude|require|connect|grant|nocompat)/,
            matches;


    // Parse script metadata
    if (matches = RE_BLOCK.exec(comments)) {
        let block, prop, val;
        block = matches[1];

        while (matches = RE_PROP.exec(block)) {
            [, prop, val] = matches;
            val = val.trim();

            if (KEY_VALUES.test(prop)) {
                if (matches = RE_KEY_VAL.exec(val)) {
                    val = {};
                    val[matches[1]] = matches[2].trim();
                    metadata[prop] = metadata[prop] || {};
                    Object.assign(metadata[prop], val);
                }
                continue;
            }else if(ARRAY_TAGS.test(prop)){
                metadata[prop] = metadata[prop] || [];
                metadata[prop].push(val);
                continue;
            }
            if (val == "") val = true;
            metadata[prop] = val;
        }
    }



    console.debug(metadata);


    





    Object.assign(exports, {
        metadata,

    });
}));
