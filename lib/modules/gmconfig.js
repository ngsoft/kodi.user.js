/** gmconfig.js */
(function (root, factory) {
    /* globals define, require, module, self, exports, unsafeWindow */
    let name = 'gmconfig', deps = ['emitter', 'gmtools', 'kodi'];
    if (typeof define === 'function' && define.amd) {
        define(name, deps, factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        module.exports = factory(...deps.map(d => require(d)));
    } else {
        root[name] = factory(...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function(emitter, gmtools, kodi, undef){


    const global = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const { document } = global;


    /**
     * Test if given argument is a plain object
     * @param {any} v
     * @returns {Boolean}
     */
    function isPlainObject(v) {
        return v instanceof Object && Object.getPrototypeOf(v) === Object.prototype;
    }

    /**
     * 
     * @param {string} tagName 
     * @param {Object} [attributes]
     * @param {string} [innerHTML]
     * @returns {HTMLElement|undefined}
     */
    function createElement(tagName = 'div', attributes = null, innerHTML = '') {

        attributes = isPlainObject(attributes) ? attributes : {};


        let
            elem = document.createElement(tagName),
            props = Object.keys(attributes), prop;

        for (let i = 0; i < props.length; i++) {
            prop = props[i];

            if (prop === 'data' && isPlainObject(attributes[prop])) {
                Object.keys(attributes[prop]).forEach(key => {
                    elem.dataset[key] = attributes[prop][key];
                });
                continue;
            } else if (prop.indexOf('data-') === 0) {
                let key = prop.replace(/^data\-/, '');
                elem.dataset[key] = attributes[prop];
                continue;
            }

            if (typeof attributes[prop] !== "string") elem[prop] = attributes[prop];
            else elem.setAttribute(prop, attributes[prop]);
        }
        if (innerHTML.length > 0)
            elem.innerHTML = innerHTML;


        return elem;

    }



    /**
     * Creates an HTMLElement from html code
     * @param {string} html
     * @returns {HTMLElement}
     */
    function html2element(html = '<div/>') {
        if (typeof html === "string") {
            let template = document.createElement('template');
            html = html.trim();
            template.innerHTML = html;
            return template.content.firstChild;
        }
    }

    /**
     * Creates a Document from html code
     * @param {string} html
     * @returns {documentElement}
     */
    function html2doc(html = '') {
        let node = document.implementation.createHTMLDocument().documentElement;
        if (typeof html === 'string' && html.length > 0) {
            node.innerHTML = html;
        }
        return node;
    }



    emitter.on('message', e => console.debug(e));


    let html = `<!DOCTYPE html>
    <html>
        <head>
            <title>Configuration</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
    
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-nord.min.css">
            <style type="text/css">
                input:not([type="checkbox"][type="radio"][type="hidden"]), select, textarea{width:85%;}
            </style>



        </head>
        <body>
            <header>
                <a href="/" class="logo">KodiCast Configuration</a>
            </header>
            <div class="container">
                <form>
                    <fieldset>
                        <legend>Servers</legend>
                            <div class="row responsive-label">
                                <div class="col-sm-12 col-md-3"><label for="servers">Server</label></div>
                                <div class="col-sm-12 col-md"><select id="servers" name="servers"></select></div>
                            </div>
                            <hr>
                            <input type="hidden" name="id" id="id" value="" />
                            <div class="row responsive-label">
                                <div class="col-sm-12 col-md-3"><label for="name">Name</label></div>
                                <div class="col-sm-12 col-md"><input type="text" name="name" id="name" placeholder="LOCALHOST"/></div>
                            </div>

                            <div class="row responsive-label">
                                <div class="col-sm-12 col-md-3"><label for="host">Host</label></div>
                                <div class="col-sm-12 col-md"><input type="text" name="host" id="host" placeholder="127.0.0.1"/></div>
                            </div>
                            <div class="row responsive-label">
                                <div class="col-sm-12 col-md-3"><label for="host">Port</label></div>
                                <div class="col-sm-12 col-md"><input type="number" name="port" id="port" placeholder="8080" min="1" max="65535" /></div>
                            </div>

                            <hr>
                            <div class="row responsive-label">
                                <div class="col-sm-12 col-md-3"><label for="user">Username</label></div>
                                <div class="col-sm-12 col-md"><input type="text" name="user" id="user" placeholder="Username"/></div>
                            </div>
                            <div class="row responsive-label">
                                <div class="col-sm-12 col-md-3"><label for="password">Password</label></div>
                                <div class="col-sm-12 col-md"><input type="password" name="password" id="password" placeholder="Password"/></div>
                            </div>
                            <div class="row responsive-label">
                                <div class="col-sm-12 col-md-3"></div>
                                <div class="col-sm-12 col-md" style="text-align:right;"><button class="primary" id="save" type="button">Save</button></div>
                            </div>
                            
                        
                    </fieldset>
                    
                </form>
            </div>

        </body>
    </html>`;


    gmtools.addStyle(`
        iframe#gmconfig_frame {
            position: absolute; top:0; left:0;
            z-index: 2147483646;
            width: 100%;height: 100%;
        }
    `);



    gmtools.menu.addItem('Configure ' + gmtools.info.script.name, () => {
        let blob = new Blob([html], {type: "text/html"}), objURL = URL.createObjectURL(blob);

        let ifr = createElement('iframe', {
            id: 'gmconfig_frame',
            src: objURL,
            seamless: true,

            onload(e){


                console.debug(e.target.contentWindow, e.target.contentDocument, e.target.contentDocument.querySelector('form'));
                let form = e.target.contentDocument.querySelector('form');
                emitter(form).on('change submit', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.debug(e);
                });

                emitter(form.querySelector('button#save')).on('click', e => {


                    e.preventDefault();
                    console.debug(e);

                    document.body.removeChild(ifr);

                });

                e.target.contentWindow.parent.postMessage(JSON.stringify({event: e, data: {}}), '*');
                URL.revokeObjectURL(objURL);
                notify.notice('Configuration openned.');


            }
        });


        document.body.appendChild(ifr);
    });

















}));
