/** gmconfig.js */
(function (root, factory) {
    /* globals define, require, module, self, exports, unsafeWindow */
    let name = 'gmconfig', deps = ['emitter', 'gmtools', 'kodi', 'notify'];
    if (typeof define === 'function' && define.amd) {
        define(name, deps, factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        module.exports = factory(...deps.map(d => require(d)));
    } else {
        root[name] = factory(...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function(emitter, gmtools, kodi, notify, undef){


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

    let html = `<!DOCTYPE html>
    <html>
        <head>
            <title>Configuration</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
    
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-nord.min.css">
            <style type="text/css">
                
                
                :root{
                    --black: #0a0a0a;
                    --dark: #363636;
                    --gray-darker: #4a4a4a;
                    --gray-dark: #696969;
                    --gray: #708090;
                    --gray-light: #d3d3d3;
                    --gray-lighter: #f5f5f5;
                    --white: #ffffff;
                    --light: #f8f8f8;
                    --lighter: #fafafa;
                    --red: #dc143c;
                    --pink: #ee82ee;
                    --orange: #ff8c00;
                    --yellow: #ffd700;
                    --purple: #9370db;
                    --green: #48c774;
                    --blue: #3273dc;
                    --cyan: #209cee;
                    --brown: #cd863f;
                    --primary: #5e81ac; 
                    --secondary: #bf616a;
                    --tertiary: #a3be8c;
                    --inverse: #3b4252;
                    --success: #48c774;
                    --info: #209cee;
                    --warning: #ff8c00;
                    --danger: #dc143c;
                }
                input:not([type="checkbox"],[type="radio"],[type="hidden"],[type="button"],[type="submit"]), select, textarea{width:85%;}
                header{position: relative;}
                #close{position: absolute; top:0; right:0;}
                .pill{
                    display: inline-block;
                    background-color: #88c0d0;
                    border-radius: 1rem;
                    box-sizing: border-box;
                    white-space: nowrap;
                    margin: 0 .2rem;
                    vertical-align: middle;
                    padding: 0 .8rem;
                }
                .pill:empty{
                    content: "";
                    min-width: auto;
                    border-radius: 50%;
                    padding: .4rem;
                }

                .color.black{color: var(--black) !important;}
                .bg.black, .pill.black{background-color: var(--black) !important;}
                .border.black{border-color: var(--black) !important;}
                .color.dark{color: var(--dark) !important;}
                .bg.dark, .pill.dark{background-color: var(--dark) !important;}
                .border.dark{border-color: var(--dark) !important;}
                .color.gray{color: var(--gray) !important;}
                .bg.gray, .pill.gray{background-color: var(--gray) !important;}
                .border.gray{border-color: var(--gray) !important;}
                .color.white{color: var(--white) !important;}
                .bg.white, .pill.white{background-color: var(--white) !important;}
                .border.white{border-color: var(--white) !important;}
                .color.light{color: var(--light) !important;}
                .bg.light, .pill.light{background-color: var(--light) !important;}
                .border.light{border-color: var(--light) !important;}
                .color.lighter{color: var(--lighter) !important;}
                .bg.lighter, .pill.lighter{background-color: var(--lighter) !important;}
                .border.lighter{border-color: var(--lighter) !important;}
                .color.red{color: var(--red) !important;}
                .bg.red, .pill.red{background-color: var(--red) !important;}
                .border.red{border-color: var(--red) !important;}
                .color.pink{color: var(--pink) !important;}
                .bg.pink, .pill.pink{background-color: var(--pink) !important;}
                .border.pink{border-color: var(--pink) !important;}
                .color.orange{color: var(--orange) !important;}
                .bg.orange, .pill.orange{background-color: var(--orange) !important;}
                .border.orange{border-color: var(--orange) !important;}
                .color.yellow{color: var(--yellow) !important;}
                .bg.yellow, .pill.yellow{background-color: var(--yellow) !important;}
                .border.yellow{border-color: var(--yellow) !important;}
                .color.purple{color: var(--purple) !important;}
                .bg.purple, .pill.purple{background-color: var(--purple) !important;}
                .border.purple{border-color: var(--purple) !important;}
                .color.green{color: var(--green) !important;}
                .bg.green, .pill.green{background-color: var(--green) !important;}
                .border.green{border-color: var(--green) !important;}
                .color.blue{color: var(--blue) !important;}
                .bg.blue, .pill.blue{background-color: var(--blue) !important;}
                .border.blue{border-color: var(--blue) !important;}
                .color.cyan{color: var(--cyan) !important;}
                .bg.cyan, .pill.cyan{background-color: var(--cyan) !important;}
                .border.cyan{border-color: var(--cyan) !important;}
                .color.brown{color: var(--brown) !important;}
                .bg.brown, .pill.brown{background-color: var(--brown) !important;}
                .border.brown{border-color: var(--brown) !important;}
                .color.primary{color: var(--primary) !important;}
                .bg.primary, .pill.primary{background-color: var(--primary) !important;}
                .border.primary{border-color: var(--primary) !important;}
                .color.secondary{color: var(--secondary) !important;}
                .bg.secondary, .pill.secondary{background-color: var(--secondary) !important;}
                .border.secondary{border-color: var(--secondary) !important;}
                .color.success{color: var(--success) !important;}
                .bg.success, .pill.success{background-color: var(--success) !important;}
                .border.success{border-color: var(--success) !important;}
                .color.info{color: var(--info) !important;}
                .bg.info, .pill.info{background-color: var(--info) !important;}
                .border.info{border-color: var(--info) !important;}
                .color.warning{color: var(--warning) !important;}
                .bg.warning, .pill.warning{background-color: var(--warning) !important;}
                .border.warning{border-color: var(--warning) !important;}
                .color.danger{color: var(--danger) !important;}
                .bg.danger, .pill.danger{background-color: var(--danger) !important;}
                .border.danger{border-color: var(--danger) !important;}
            </style>
        </head>
        <body>
            <header>
                <a href="/" class="logo">KodiCast Configuration</a>
                <button id="close" title="Close">&times;</span>
            </header>
            <div class="container">
                <form>
                    <h3>Servers <small>Input your server location</small></h3>
                     <hr>
                    <fieldset>
                        <div class="row responsive-label">
                            <div class="col-sm-12 col-md-3"><label for="servers">Select Server</label></div>
                            <div class="col-sm-12 col-md">
                                <span class="pill" id="ping"></span>
                                <select id="servers" name="servers"></select>
                            </div>
                        </div>
                        <hr>
                        <input type="hidden" name="id" id="id" value="" />
                        <div class="row responsive-label">
                            <div class="col-sm-12 col-md-3"><label for="name">Name</label></div>
                            <div class="col-sm-12 col-md"><input type="text" name="name" id="name" placeholder="LOCALHOST" /></div>
                        </div>

                        <div class="row responsive-label">
                            <div class="col-sm-12 col-md-3"><label for="host">Host</label></div>
                            <div class="col-sm-12 col-md"><input type="text" name="host" id="host" placeholder="127.0.0.1"/></div>
                        </div>
                        <div class="row responsive-label">
                            <div class="col-sm-12 col-md-3"><label for="port">Port</label></div>
                            <div class="col-sm-12 col-md"><input type="number" name="port" id="port" placeholder="8080" min="1" max="65535" /></div>
                        </div>
                        <div class="row responsive-label">
                            <div class="col-sm-12 col-md-3"><label for="secure">Secure</label></div>
                            <div class="col-sm-12 col-md"><input type="checkbox" name="secure" id="secure" /></div>
                        </div>
                        <div class="row responsive-label">
                            <div class="col-sm-12 col-md-3"><label for="enabled">Enabled</label></div>
                            <div class="col-sm-12 col-md"><input type="checkbox" name="enabled" id="enabled" /></div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <hr>
                        <div class="row responsive-label">
                            <div class="col-sm-12 col-md-3"><label for="user">Username</label></div>
                            <div class="col-sm-12 col-md"><input type="text" name="user" id="user" placeholder="Username"/></div>
                        </div>
                        <div class="row responsive-label">
                            <div class="col-sm-12 col-md-3"><label for="password">Password</label></div>
                            <div class="col-sm-12 col-md"><input type="password" name="password" id="password" placeholder="Password"/></div>
                        </div>
                    </fieldset>
                    <hr>
                    <div class="row">
                        <div class="col-sm-12 col-md" style="text-align:right;">
                            <button type="button" class="secondary" id="remove-server"><span class="icon-alert"></span>Remove Server</button>
                            <button type="button" id="add-server"><span class="icon-edit"></span>Create Server</button>
                            <button class="primary" id="save" type="button"><span class="icon-upload"></span>Save Server</button>
                        </div>
                    </div>

                </form>
            </div>

        </body>
    </html>`;



    async function init(root){
        
        let
                form = root.querySelector('form'),
                elements = form.elements,
                servers ,
                serverData,
                id,
                server,
                ping = form.querySelector('#ping'),
                pingServer = function(){

                    if (server) {
                        ping.setAttribute('class', 'pill warning');
                        server.ping().then(result => {
                            if (result === true) {
                                ping.setAttribute('class', 'pill success');
                            } else ping.setAttribute('class', 'pill danger');
                        });
                    }
                };



        emitter(root).on('click', e => {
            let elem;
            if (e.target.closest('#close')) {
                Configure.hide();
            } else if (e.target.closest('#save')) {
                //save
                if (server) {
                    server.save().then(() => {
                        emitter(form).trigger('initialize');
                        notify.success('Server Configuration saved.', server.name);
                    });
                }

            }


        });

        emitter(elements.servers).on('change', e => {
            e.preventDefault();
            id = e.target.value;
            server = serverData[id];
            elements.password.value = '';
            ['id', 'name', 'host', 'port', 'user'].forEach(key => {
                elements[key].value = server[key];
            });

            elements.enabled.checked = server.enabled === true ? true : null;
            elements.secure.checked = server.secure === true ? true : null;

            pingServer();
        });
        emitter(form).on('change submit', e => {
            e.preventDefault();
            let name;
            if ((name = e.target.name)) {

                let changed = true;

                if (['id', 'name', 'host', 'port'].includes(name)) {
                    server[name] = e.target.value;
                    changed = true;
                }
                else if (['enabled', 'secure'].includes(name)) {
                    server[name] = e.target.checked === true;
                } else if (name === 'password') {
                    server.setCredentials(elements.user.value, elements.password.value);
                } else changed = false;

                if (changed && server) pingServer();
            }

        }).on('initialize', ()=>{
            
            kodi.getServers().then(slist=>{
                serverData = {};
                servers = slist;
                elements.servers.innerHTML = '';
                servers.forEach(server => {
                    elements.servers.appendChild(createElement('option', {value: server.id}, server.name));
                    serverData[server.id] = server;
                });
                elements.servers.selectedIndex = 0;
                emitter(elements.servers).trigger('change');
            });
            
            


        }).trigger('initialize');
            
            



        

        console.debug(servers);

      




        


        console.debug(elements);



        
        

    }



    class Configure {

        static get open(){
            return  document.querySelector('iframe#gmconfig_frame') !== null;
        }

        static show(){
            return new Promise(rsl=>{
                 if (!this.open) {

                    let src = URL.createObjectURL(new Blob([html], {type: "text/html"})), t = this;

                    this.ifrm = createElement('iframe', {
                        id: 'gmconfig_frame',
                        src: src,
                        seamless: true,
                        style: 'position: absolute; top:0; left:0; z-index: 2147483646; width: 100%;height: 100%;',
                        onload(e){
                            init(e.target.contentDocument);
                            URL.revokeObjectURL(src);
                            rsl();
                        }
                    });
                    document.body.appendChild(this.ifrm);

                } else rsl();
            });

        }


        static async hide(){

            if (this.open) {
                document.body.removeChild(this.ifrm);
            }
            return;
        }


    }





    gmtools.menu.addItem('Configure ' + gmtools.info.script.name, () => {
        Configure.show();
    }, 'configure');


}));
