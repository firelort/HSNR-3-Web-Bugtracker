class Application_cl {
    constructor() {
        // Registrieren zum Empfang von Nachrichten
        APPUTIL.es_o.subscribe_px(this, "templates.loaded");
        APPUTIL.es_o.subscribe_px(this, "templates.failed");
        APPUTIL.es_o.subscribe_px(this, "app.cmd");

        this.header_o = new Header_cl("header", "header.tpl.html");
        this.nav_o = new Navigation_cl("nav", "navbar.tpl.html");
        this.login_o  = new Login_cl("login.tpl.html");
    }

    notify_px(self, message_spl, data_opl) {
        switch (message_spl) {
            case "templates.failed":
                alert("Vorlagen konnten nicht geladen werden.");
                break;
            case "templates.loaded":
                // Templates stehen zur Verfügung, Bereiche mit Inhalten füllen
                self.header_o.render_px([{
                    "name": "Hartings, Robert",
                    "number": 1164453
                }, {
                    "name": "Ionescu, Christopher",
                    "number": 1170755
                }
                ]);


                self.login_o.render_px();

                // Add EventHandler for success and alert box
                let button = document.querySelector('.alert-success-button');
                button.addEventListener('click', function (event) {
                    document.querySelector('#success-box').setAttribute("hidden", '');
                    document.querySelector('#alert-box').setAttribute("hidden", '');
                    event.preventDefault();
                    event.stopPropagation();
                });
                break;

            case "app.cmd":
                // hier müsste man überprüfen, ob der Inhalt gewechselt werden darf
                switch (data_opl[0]) {
                    case "home":
                        let markup_s = APPUTIL.tm_o.execute_px("home.tpl.html", null);
                        let el_o = document.querySelector("main");
                        if (el_o != null) {
                            el_o.innerHTML = markup_s;
                        }
                        break;
                    case "list":
                        // Daten anfordern und darstellen
                        this.listView_o.render_px();
                        break;
                    case "detail":
                        this.detailView_o.render_px(data_opl[1]);
                        break;
                    case "idBack":
                        APPUTIL.es_o.publish_px("app.cmd", ["list", null]);
                        break;
                    case "alert":
                        document.querySelector('#alert-box').removeAttribute("hidden");
                        document.querySelector('#alert-text').innerText = data_opl[1];
                        break;
                    case "success":
                        document.querySelector('#success-box').removeAttribute("hidden");
                        document.querySelector('#success-text').innerText = data_opl[1];
                        break;
                    case "logged-in":
                        self.nav_o.render_px();
                        break;
                    case "logged-out":
                        self.login_o.render_px();
                        break;
                }
                break;
        }
    }
}

window.onload = function () {
    APPUTIL.es_o = new APPUTIL.EventService_cl();
    var app_o = new Application_cl();
    APPUTIL.createTemplateManager_px();
}