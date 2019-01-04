class Application_cl {
    constructor() {
        // Registrieren zum Empfang von Nachrichten
        APPUTIL.es_o.subscribe_px(this, "templates.loaded");
        APPUTIL.es_o.subscribe_px(this, "templates.failed");
        APPUTIL.es_o.subscribe_px(this, "app.cmd");

        this.header_o = new Header_cl("header", "header.tpl.html");
        this.nav_o = new Navigation_cl("aside", "navbar.tpl.html");
        this.login_o = new Login_cl("main", "login.tpl.html");
        this.employeeList_o = new Employee_cl("main", "employee-list.tpl.html")
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
                        document.querySelector('main').innerHTML = "";
                        break;
                    case "all-errors":
                        break;
                    case "all-projects":
                        break;
                    case "all-components":
                        break;
                    case "all-employees":
                        self.employeeList_o.render_px();
                        break;
                    case "all-categories":
                        break;
                    case "eval-pro-err":
                        break;
                    case "eval-cat-err":
                        break;
                    case "logout":
                        self.login_o.render_px();
                        document.querySelector("aside").innerHTML = "";
                        break;
                    case "logged-in":
                        self.nav_o.render_px();
                        APPUTIL.es_o.publish_px("app.cmd", ["home", null]);
                        break;
                    case "alert":
                        document.querySelector('#alert-box').removeAttribute("hidden");
                        document.querySelector('#alert-text').innerHTML = data_opl[1];
                        break;
                    case "success":
                        document.querySelector('#success-box').removeAttribute("hidden");
                        document.querySelector('#success-text').innerHTML = data_opl[1];
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
};