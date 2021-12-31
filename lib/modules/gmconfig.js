/** gmconfig.js */
(function (root, factory) {
    /* globals define, require, module, self, exports */
    let name = 'gmconfig', deps = ['utils', 'emitter', 'gmtools', 'kodi', 'notify', 'langcode', 'storage'];
    if (typeof define === 'function' && define.amd) {
        define(name, deps, factory);
    } else if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
        module.exports = factory(...deps.map(d => require(d)));
    } else {
        root[name] = factory(...deps.map(d => root[d]));
    }

}(typeof self !== 'undefined' ? self : this, function (utils, emitter, gmtools, kodi, notify, langcode, storage, undef) {


    const { global, document, createElement } = utils;
    const { GM_Storage } = storage;





    let html = `<!DOCTYPE html>
    <html>
        <head>
            <title>Configuration</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
    
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css">
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
                input:not([type="checkbox"],[type="radio"],[type="hidden"],[type="button"],[type="submit"]), select, textarea{width:100%;}
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
                [hidden], template {display: none !important;}
                [data-tab][data-selected="true"].button{pointer-events: none;}
            </style>
        </head>
        <body>
            <header>
                <a href="/" class="logo">KodiCast Configuration</a>
                <a href="#" class="button" data-tab="servers">Servers</a>
                <a href="#" class="button" data-tab="addons">Addons</a>
                <button id="close" title="Close">&times;</span>
            </header>
            <div class="container" data-tab="servers">
                <form>
                    <h3>Servers <small>Input your server location</small></h3>
                     <hr>
                    <fieldset>
                        <div class="row responsive-label">
                            <div class="col-sm-12 col-md-3"><label for="servers">Select Server</label></div>
                            <div class="col-sm-12 col-md" style="position: relative;">
                                <span title="Server Ping" class="pill" id="ping" style="position: absolute;top: 50%;left: 0;transform: translate(-1rem,-50%);"></span>
                                <select id="servers" name="servers"></select>
                            </div>
                            <div class="col-sm-12 col-md-2"></div>
                        </div>
                        <hr>
                        <input type="hidden" name="id" id="id" value="" />
                        <div class="row responsive-label">
                            <div class="col-sm-12 col-md-3"><label for="name">Name</label></div>
                            <div class="col-sm-12 col-md"><input type="text" name="name" id="name" placeholder="LOCALHOST" /></div>
                            <div class="col-sm-12 col-md-2"></div>
                        </div>

                        <div class="row responsive-label">
                            <div class="col-sm-12 col-md-3"><label for="host">Host</label></div>
                            <div class="col-sm-12 col-md"><input type="text" name="host" id="host" placeholder="127.0.0.1"/></div>
                            <div class="col-sm-12 col-md-2"></div>
                        </div>
                        <div class="row responsive-label">
                            <div class="col-sm-12 col-md-3"><label for="port">Port</label></div>
                            <div class="col-sm-12 col-md"><input type="number" name="port" id="port" placeholder="8080" min="1" max="65535" /></div>
                            <div class="col-sm-12 col-md-2"></div>
                        </div>
                        <div class="row responsive-label">
                            <div class="col-sm-12 col-md-3"><label for="secure">Secure</label></div>
                            <div class="col-sm-12 col-md"><input type="checkbox" name="secure" id="secure" /></div>
                            <div class="col-sm-12 col-md-2"></div>
                        </div>
                        <div class="row responsive-label">
                            <div class="col-sm-12 col-md-3"><label for="enabled">Enabled</label></div>
                            <div class="col-sm-12 col-md"><input type="checkbox" name="enabled" id="enabled" /></div>
                            <div class="col-sm-12 col-md-2"></div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <hr>
                        <div class="row responsive-label">
                            <div class="col-sm-12 col-md-3"><label for="user">Username</label></div>
                            <div class="col-sm-12 col-md"><input type="text" name="user" id="user" placeholder="Username"/></div>
                            <div class="col-sm-12 col-md-2"></div>
                        </div>
                        <div class="row responsive-label">
                            <div class="col-sm-12 col-md-3"><label for="password">Password</label></div>
                            <div class="col-sm-12 col-md"><input type="password" name="password" id="password" placeholder="Password"/></div>
                            <div class="col-sm-12 col-md-2"></div>
                        </div>
                    </fieldset>
                    <div class="row">
                        <div class="col-sm-12 col-md" style="text-align:right;">
                            <button type="button" class="secondary" id="remove-server"><span class="icon-alert"></span>Remove Server</button>
                            <button type="button" id="add-server"><span class="icon-edit"></span>Create Server</button>
                            <button class="primary" id="save" type="button"><span class="icon-upload"></span>Save Server</button>
                        </div>
                        <div class="col-sm-12 col-md-1"></div>
                    </div>

                </form>
            </div>
            <div class="container" data-tab="addons">
                <form>
                    <h3>Addons <small>Configure Addons</small></h3>
                    <hr>
                    <fieldset>
                        <div class="row responsive-label">
                            <div class="col-sm-12 col-md-3"><label for="subtitles">Subtitles</label></div>
                            <div class="col-sm-12 col-md"><select name="subtitles" id="subtitles"></select></div>
                            <div class="col-sm-12 col-md-2"><button class="small primary" id="add-language" type="button" title="Add Language"><span class="icon-upload"></span></button></div>
                        </div>
                        <template class="sub-list-template">
                            <div class="row subtitle-language">
                            <div class="col-sm-12 col-md-3"></div>
                            <div class="col-sm-12 col-md"><input type="text" value="{{ name }}" disabled></div>
                            <div class="col-sm-12 col-md-2"><button type="button" class="small secondary" title="Remove language" data-lang="{{ alpha2 }}"><span class="icon-alert"></span></button></div>
                            </div>
                        </template>
                    </fieldset>
                </form>
            </div>

        </body>
    </html>`,
        css = `
                html.noscroll {position: fixed;  overflow-y: hidden; width: 100%;z-index:-1;}
                #gmconfig_overlay{position:fixed; z-index:2147483645; top:0; left:0; width:100%;height:100%;background-color:rgba(0,0,0,.8);overflow-y:scroll;margin: 0; padding:0;}
                iframe#gmconfig_frame{position: fixed; top:5%; left:50%; z-index: 2147483646;transform:translateX(-50%);width: 80%;min-height: 700px;}
                @media screen and (max-width: 767px) {iframe#gmconfig_frame{top:0; left: 0; width:100%; height: 100%; transform:unset;}}
            `, cssElem;



    async function init(root) {

        let
            form = root.querySelector('[data-tab="servers"] form'),
            addonsForm = root.querySelector('[data-tab="addons"] form'),
            elements = form.elements,
            servers,
            serverData,
            id,
            server,
            ping = form.querySelector('#ping'),
            pingServer = function () {

                if (server) {
                    ping.setAttribute('class', 'pill warning');
                    server.ping().then(result => {
                        if (result === true) {
                            ping.setAttribute('class', 'pill success');
                        } else ping.setAttribute('class', 'pill danger');
                    });
                }
            },
            lastIndex = 0;



        emitter(root).on('click', e => {
            let target;
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

            } else if (e.target.closest('#add-server')) {

                kodi.createServer().then(slist => {
                    let last = slist.pop(), index = servers.length;
                    servers.push(last);
                    serverData[last.id] = last;
                    elements.servers.appendChild(createElement('option', { value: last.id }, last.name));
                    // elements.servers.size = servers.length;
                    elements.servers.selectedIndex = index;
                    emitter(elements.servers).trigger('change');
                    notify.success('Server created.', last.name);
                });

            } else if (e.target.closest('#remove-server')) {
                kodi.removeServer(id).then(() => {
                    lastIndex--;
                    if (lastIndex < 0) lastIndex = 0;
                    notify.message('Server removed.', server.name);
                    emitter(form).trigger('initialize');
                });
            } else if ((target = e.target.closest('header [data-tab].button'))) {
                e.preventDefault();
                let tab = target.dataset.tab, tabContainer = root.querySelector(`[data-tab="${tab}"].container`);
                root.querySelectorAll('header [data-tab].button').forEach(btn => btn.dataset.selected = null);
                root.querySelectorAll('[data-tab].container').forEach(cnt => cnt.hidden = true);
                target.dataset.selected = true;
                if (tabContainer) tabContainer.hidden = null;
            } else if ((target = e.target.closest('button#add-language'))) {
                let value = addonsForm.querySelector('select#subtitles').value;
                GM_Storage.get('subtitles', []).then(sublist => {
                    if (!sublist.includes(value)) {
                        sublist.push(value);
                        GM_Storage.set('subtitles', sublist).then(() => {
                            let
                                field = target.closest('fieldset'),
                                template = addonsForm.querySelector('template.sub-list-template').innerHTML,
                                item = langcode(value);
                            field.innerHTML += template.replace(/[\{]{2}\s*([^\s]+)\s*[\}]{2}/g, (m, p) => item[p]);
                            //notify.message(item.name + ' language added.');
                        });
                    }
                });
            } else if ((target = e.target.closest('.subtitle-language button.secondary'))) {
                let
                    field = target.closest('fieldset'),
                    elem = target.closest('.subtitle-language'),
                    value = target.dataset.lang, name = elem.querySelector('input').value;
                GM_Storage.get('subtitles', []).then(sublist => {

                    sublist = sublist.filter(lang => lang !== value);
                    GM_Storage.set('subtitles', sublist).then(() => {
                        field.removeChild(elem);
                        // notify.message(name + ' language removed.');
                    });

                });
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

            lastIndex = elements.servers.selectedIndex;

            form.querySelector('#remove-server').disabled = servers.length > 1 ? null : true;

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
                } else if (['password', 'user'].includes(name)) {
                    server.setCredentials(elements.user.value, elements.password.value);
                } else changed = false;

                if (changed && server) pingServer();
            }

        }).on('initialize', () => {

            kodi.getServers().then(slist => {
                serverData = {};
                servers = slist;
                elements.servers.innerHTML = '';
                servers.forEach(server => {
                    elements.servers.appendChild(createElement('option', { value: server.id }, server.name));
                    serverData[server.id] = server;
                });
                //  elements.servers.size = servers.length;
                elements.servers.selectedIndex = lastIndex;
                emitter(elements.servers).trigger('change');
            });

        }).trigger('initialize');

        emitter(addonsForm).on('change submit', e => {
            e.preventDefault();
        }).on('initialize', e => {

            let
                select = addonsForm.querySelector('select#subtitles'),
                template = addonsForm.querySelector('template.sub-list-template').innerHTML;
            select.innerHTML = '';

            langcode.database.forEach(item => {
                select.appendChild(createElement('option', { value: item.alpha2 }, item.name));
            });

            GM_Storage.get('subtitles', ['en', 'fr']).then(sublist => {
                let field = select.closest('fieldset');
                sublist.forEach(lang => {
                    if ((item = langcode(lang))) {
                        field.innerHTML += template.replace(/[\{]{2}\s*([^\s]+)\s*[\}]{2}/g, (m, p) => item[p]);
                    }
                });
            });


        }).trigger('initialize');
    }



    class Configure {

        static get open() {
            return document.querySelector('iframe#gmconfig_frame') !== null;
        }

        static show() {
            return new Promise(rsl => {
                if (!this.open) {
                    cssElem = cssElem || gmtools.addStyle(css);
                    let src = URL.createObjectURL(new Blob([html], { type: "text/html" })), pos = document.documentElement.scrollTop;
                    if (pos < 0) pos = 0;
                    this.overlay = createElement('div', { id: 'gmconfig_overlay' });
                    emitter(this.overlay).one('click', e => Configure.hide());

                    this.ifrm = createElement('iframe', {
                        id: 'gmconfig_frame',
                        src: src,
                        seamless: true,
                        onload(e) {
                            cssElem.innerHTML += `html.noscroll{top:-${pos}px;}`;
                            document.documentElement.classList.add('noscroll');
                            init(e.target.contentDocument);
                            URL.revokeObjectURL(src);
                            rsl();
                        }
                    });

                    emitter(this.ifrm).one('overlayclose', e => {
                        e.preventDefault();
                        document.body.removeChild(this.overlay);
                        document.documentElement.classList.remove('noscroll');
                        if (pos > 0) document.documentElement.scrollTo(0, pos);
                    });

                    this.overlay.appendChild(this.ifrm);

                    document.body.appendChild(this.overlay);

                } else rsl();
            });

        }


        static async hide() {

            if (this.open) {

                emitter(this.ifrm).trigger('overlayclose');
            }
            return;
        }



        static toggle() {
            if (!this.open) return this.show();
            return this.hide();
        }


        static initialize() {
            gmtools.menu.addItem('Configure ' + gmtools.info.script.name, () => {
                Configure.toggle();
            }, 'configure');
        }


    }


    return Configure;

}));
