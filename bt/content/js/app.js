class Application_cl {
    constructor() {
        // Registrieren zum Empfang von Nachrichten
        APPUTIL.es_o.subscribe_px(this, "templates.loaded");
        APPUTIL.es_o.subscribe_px(this, "templates.failed");
        APPUTIL.es_o.subscribe_px(this, "app.cmd");
        APPUTIL.es_o.subscribe_px(this, "alert");
        APPUTIL.es_o.subscribe_px(this, "success");

        this.header_o = new Header_cl("header", "header.tpl.html");
        this.nav_o = new Navigation_cl("aside", "navbar.tpl.html");
        this.login_o = new Login_cl("main", "login.tpl.html");

        this.employeeList_o = new Employee_cl();
        this.employeeView_o = new EmployeeView_cl();
        this.employeeEdit_o = new EmployeeEdit_cl();
        this.employeeAdd_o = new EmployeeAdd_cl("main", "employee-edit.tpl.html");

        this.projectList_o = new Projects_cl();
        this.projectView_o = new ProjectView_cl();
        this.projectEdit_o = new ProjectEdit_cl();
        this.projectAdd_o = new ProjectAdd_cl("main", "projekt-edit.tpl.html");

        this.componentList_o = new Components_cl();
        this.componentView_o = new ComponentView_cl();
        this.componentEdit_o = new ComponentEdit_cl();
        this.componentAdd_o = new ComponentAdd_cl("main", "komponente-edit.tpl.html");

        APPUTIL.list_o = new List_cl("main");
        APPUTIL.view_o = new View_cl("main");
        APPUTIL.edit_o = new Edit_cl("main");
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
                let button = document.querySelectorAll('.alert-success-button');
                button[0].addEventListener('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    document.querySelector('#alert-box').setAttribute("hidden", '');
                });
                button[1].addEventListener('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    document.querySelector('#success-box').setAttribute("hidden", '');
                });

                break;

            case "app.cmd":
                console.log(data_opl);
                //Skip the test if data_opl[10] is true
                if (data_opl[10] !== true) {
                    // hier müsste man überprüfen, ob der Inhalt gewechselt werden darf
                    // get all formelements
                    let form = document.querySelector("form");
                    if (form != null) {
                        let doConfirm = false;
                        for (let index = 0; index < form.length; index++) {
                            if (doConfirm === true) {
                                break;
                            }
                            let element = form[index];
                            if (element.type === "hidden") {
                                continue;
                            }
                            if (element.type === "select-one") {
                                for (let optionIndex = 0; optionIndex < element.length; optionIndex++) {
                                    if (element[optionIndex].hasAttribute("selected")) {
                                        if (element[optionIndex].value !== element.value) {
                                            console.log("Rolle hat sich geändert");
                                            doConfirm = true;
                                        }
                                        break;
                                    }
                                }
                            } else {
                                if (element.defaultValue !== element.value) {
                                    doConfirm = true;
                                    console.log("Daten haben sich geändert");
                                }
                            }
                        }
                        if (doConfirm === true) {
                            if (!confirm("Wollen Sie die Seite wirklich wechseln?")) {
                                break;
                            }
                        }
                    }
                }

                switch (data_opl[0]) {
                    case "home":
                        document.querySelector('main').innerHTML = "";
                        break;
                    case "list-view":
                        switch (data_opl[1]) {
                            case "employee":
                                self.employeeList_o.render_px();
                                break;
                            case "projekt":
                                self.projectList_o.render_px();
                                break;
                            case "projektkomponenten":
                                console.log(data_opl[1], data_opl);
                                break;
                            case "komponente":
                                self.componentList_o.render_px(data_opl[2]);
                                break;
                            case "katfehler":
                                console.log(data_opl[1], data_opl);
                                break;
                            case "fehler":
                                console.log(data_opl[1], data_opl);
                                break;
                            case "katursache":
                                console.log(data_opl[1], data_opl);
                                break;
                        }
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
                    case "single-view":
                        switch (data_opl[1]) {
                            case "employee":
                                self.employeeView_o.render_px(data_opl[2], data_opl[3]);
                                break;
                            case "projekt":
                                self.projectView_o.render_px(data_opl[2]);
                                break;
                            case "komponente":
                                self.componentView_o.render_px(data_opl[2]);
                                break;
                        }
                        break;
                    case "edit-view":
                        switch (data_opl[1]) {
                            case "employee":
                                self.employeeEdit_o.render_px(data_opl[2], data_opl[3]);
                                break;
                            case "projekt":
                                self.projectEdit_o.render_px(data_opl[2]);
                                break;
                            case "komponente":
                                self.componentEdit_o.render_px(data_opl[2]);
                                break;
                        }
                        break;
                    case "add-item":
                        switch (data_opl[1]) {
                            case "employee":
                                self.employeeAdd_o.render_px();
                                break;
                            case "projekt":
                                self.projectAdd_o.render_px();
                                break;
                            case "komponente":
                                self.componentAdd_o.render_px();
                                break;
                        }
                        break;
                }
                break;
            case "alert":
                document.querySelector('#alert-box').removeAttribute("hidden");
                document.querySelector('#alert-text').innerHTML = data_opl[0];
                break;
            case "success":
                document.querySelector('#success-box').removeAttribute("hidden");
                document.querySelector('#success-text').innerHTML = data_opl[0];
                break;
        }
    }
}

window.onload = function () {
    APPUTIL.es_o = new APPUTIL.EventService_cl();
    var app_o = new Application_cl();
    APPUTIL.createTemplateManager_px();
};