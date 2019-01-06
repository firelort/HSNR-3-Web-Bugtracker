class Employee_cl {
    constructor() {
        this.swData_o = null;
        this.qsData_o = null;
        this.role_o = null;
        this.done = [false, false, false];
        this.error = false;
    }

    saveSw(data_o) {
        this.swData_o = data_o;
        this.done[0] = true;
    }

    saveQs(data_o) {
        this.qsData_o = data_o;
        this.done[1] = true;
    }

    saveRole(data_o) {
        this.role_o = data_o;
        this.done[2] = true;
    }

    render_px() {
        this.done = [false, false, false];
        this.error = false;

        //Request the sw employee list
        let path_s = "/swentwickler/";
        let requester_o = new APPUTIL.Requester_cl();
        var qsData_o;
        requester_o.get_px(path_s,
            function (responseText_spl) {
                this.saveSw(JSON.parse(responseText_spl));
            }.bind(this), function (responseText_spl) {
                let data_o = JSON.parse(responseText_spl);
                APPUTIL.es_o.publish_px("app.cmd", ["home", null]);
                APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                this.error = true;
            }.bind(this));

        //Request the qs employee list
        path_s = "/qsmitarbeiter/";
        requester_o.get_px(path_s,
            function (responseText_spl) {
                this.saveQs(JSON.parse(responseText_spl));
            }.bind(this), function (responseText_spl) {
                let data_o = JSON.parse(responseText_spl);
                APPUTIL.es_o.publish_px("app.cmd", ["home", null]);
                APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                this.error = true;
            }.bind(this));

        //Request the role list
        path_s = "/role/";
        requester_o.get_px(path_s,
            function (responseText_spl) {
                this.saveRole(JSON.parse(responseText_spl));
            }.bind(this), function (responseText_spl) {
                let data_o = JSON.parse(responseText_spl);
                APPUTIL.es_o.publish_px("app.cmd", ["home", null]);
                APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                this.error = true;
            }.bind(this));

        //Wait for the requested data
        return setTimeout(function () {
            return this.isAllDataAv();
        }.bind(this), 1);
    }

    isAllDataAv() {
        if (this.error !== true) {
            if (this.done[0] === true && this.done[1] === true && this.done[2] === true) {
                this.doRender_p();
            } else {
                return setTimeout(function () {
                    return this.isAllDataAv();
                }.bind(this), 1);
            }
        }
    }

    doRender_p() {
        //Change the content of 'role' to the role name
        if (this.role_o !== null && this.role_o.length > 1) {
            let newSwData_o = this.swData_o;
            let newQsData_o = this.qsData_o;
            let index;

            for (index = 0; index < newSwData_o.length; index++) {
                newSwData_o[index]['roleName'] = this.role_o[1]['desc'];
            }

            for (index = 0; index < newQsData_o.length; index++) {
                newQsData_o[index]['roleName'] = this.role_o[0]['desc'];
            }

            let data_o = newSwData_o.concat(newQsData_o);
            //Render the content with the given data
            APPUTIL.list_o.render_px("employee", data_o);
            this.configHandleEvent();
        } else {
            APPUTIL.es_o.publish_px("app.cmd", ["home", null]);
            APPUTIL.es_o.publish_px("alert", ["Es ist ein Fehler mit den Rollen aufgetreten."]);
        }
    }

    configHandleEvent() {
        // add eventlistner to buttons
        let buttons = document.querySelectorAll('main div.content-footer button');
        for (let index = 0; index < buttons.length; index++) {
            buttons[index].addEventListener('click', this.handleEventButton);
        }
    }

    handleEventButton(event) {
        event.stopPropagation();
        event.preventDefault();
        let selected = document.querySelectorAll("table tbody tr.active");
        let selectedCount = selected.length;
        switch (event.target.dataset.action) {
            case "add":
                APPUTIL.es_o.publish_px("app.cmd", ["add-item", "employee"]);
                break;
            case "view":
                if (selectedCount !== 1) {
                    APPUTIL.es_o.publish_px("alert", ["Es kann nur genau ein Mitarbeiter angesehen werden!"]);
                } else {
                    APPUTIL.es_o.publish_px("app.cmd", ["single-view", "employee", selected[0].dataset.id, selected[0].dataset.roleid]);
                }
                break;
            case "edit":
                if (selectedCount !== 1) {
                    APPUTIL.es_o.publish_px("alert", ["Es kann nur genau ein Mitarbeiter bearbeitet werden!"]);
                } else {
                    APPUTIL.es_o.publish_px("app.cmd", ["edit-view", "employee", selected[0].dataset.id, selected[0].dataset.roleid]);
                }
                break;
            case "delete":
                if (selectedCount === 0) {
                    APPUTIL.es_o.publish_px("alert", ["Bitte wählen Sie Mitarbeiter aus die Sie löschen wollen!"]);
                } else {
                    let doit = true;
                    if (selectedCount === 1) {
                        if (!confirm("Wollen Sie den markierten Mitarbeiter wirklich löschen?")) {
                            doit = false;
                        }
                    } else {
                        if (!confirm("Wollen Sie die markierten Mitarbeiter wirklich löschen?")) {
                            doit = false;
                        }
                    }
                    if (doit) {
                        //Request Delete of given Employees
                        let ids = []; //Int array
                        let index;
                        for (index = 0; index < selectedCount; index++) {
                            ids.push(parseInt(selected[index].dataset.id, 10))
                        }

                        let path_s = "/employee/";
                        let requester_o = new APPUTIL.Requester_cl();
                        requester_o.delete_px(path_s, ids,
                            function (responseText_spl) {
                                let data_o = JSON.parse(responseText_spl);
                                APPUTIL.es_o.publish_px("success", [data_o['message']]);

                                //Remove the entries from the table
                                for (index = 0; index < selectedCount; index++) {
                                    selected[index].parentNode.removeChild(selected[index]);
                                }

                            }, function (responseText_spl) {
                                let data_o = JSON.parse(responseText_spl);
                                APPUTIL.es_o.publish_px("alert", [(data_o['message'] + "<br /> Bitte laden Sie die Mitarbeiterliste neu.")]);
                            });
                    }
                }
                break;
        }
    }
}

class EmployeeView_cl {

    render_px(userid, roleid) {
        let finished = false;
        let role;
        let path_s;
        if (roleid === "1") {
            path_s = "qsmitarbeiter";
            role = "QS-Mitarbeiter";
        } else if (roleid === "2") {
            path_s = "swentwickler";
            role = "SE-Mitarbeiter";
        } else {
            APPUTIL.es_o.publish_px("alert", ["Diese Rolle existiert nicht."]);
            finished = true;
        }
        if (!finished) {
            let requester_o = new APPUTIL.Requester_cl();
            requester_o.get_px("/" + path_s + "/?id=" + userid,
                function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    data_o.roleName = role;
                    APPUTIL.view_o.render_px("employee", data_o, path_s);
                }, function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                });
        }
    }
}

class EmployeeEdit_cl {
    constructor() {
        this.user_o = null;
        this.role_o = null;
        this.done = [false, false];
        this.error = false;
        this.path = null;
    }

    saveUser(data_opl) {
        this.user_o = data_opl;
        this.done[0] = true;
    }

    saveRole(data_opl) {
        this.role_o = data_opl;
        this.done[1] = true;
    }

    render_px(userid, roleid) {
        this.done = [false, false];
        this.error = false;
        let finished = false;
        let path_s;
        if (roleid === "1") {
            path_s = "qsmitarbeiter";
        } else if (roleid === "2") {
            path_s = "swentwickler";
        } else {
            APPUTIL.es_o.publish_px("alert", ["Diese Rolle existiert nicht."]);
            finished = true;
        }
        this.path = path_s;

        if (!finished) {
            let requester_o = new APPUTIL.Requester_cl();
            requester_o.get_px("/" + path_s + "/?id=" + userid,
                function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    this.saveUser(data_o);
                }.bind(this), function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                    this.error = true;
                }.bind(this));

            path_s = "/role/";
            requester_o.get_px(path_s,
                function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    this.saveRole(data_o);
                }.bind(this), function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                    this.error = true;
                }.bind(this));

            //Wait for the requested data
            return setTimeout(function () {
                return this.isAllDataAv();
            }.bind(this), 1);
        }

    }

    isAllDataAv() {
        if (this.error === false) {
            if (this.done[0] === true && this.done[1] === true) {
                this.doRender_p();
            } else {
                return setTimeout(function () {
                    return this.isAllDataAv();
                }.bind(this), 1);
            }
        }
    }

    doRender_p() {
        let userData_o = [this.user_o].concat(this.role_o);
        //Render the content with the given data
        APPUTIL.edit_o.render_px("employee", userData_o, this.path);
    }
}

class EmployeeAdd_cl {
    constructor(element, template) {
        this.element_s = element;
        this.templates_s = template;
    }

    render_px() {
        let requester_o = new APPUTIL.Requester_cl();

        requester_o.get_px("/role/", function (responseText_spl) {
            let data_o = JSON.parse(responseText_spl);
            let test_o = [true].concat(data_o);
            this.doRender_p(test_o);
        }.bind(this), function (responseText_spl) {
            let data_o = JSON.parse(responseText_spl);
            APPUTIL.es_o.publish_px("alert", [data_o['message']]);
        });
    }


    doRender_p(data_opl) {

        let markup_s = APPUTIL.tm_o.execute_px(this.templates_s, data_opl);
        let el_o = document.querySelector(this.element_s);
        if (el_o != null) {
            el_o.innerHTML = markup_s;
            this.configHandleEvent();
        }
    }

    configHandleEvent() {
        let buttons = document.querySelectorAll('main div.content-footer button');
        let index;
        for (index = 0; index < buttons.length; index++) {
            buttons[index].addEventListener('click', this.handleEvent);
        }
    }

    handleEvent(event) {
        event.stopPropagation();
        event.preventDefault();
        switch (event.target.dataset.action) {
            case "cancel":
                APPUTIL.es_o.publish_px("app.cmd", ["list-view", "employee"]);
                break;
            case "save":
                let roleId = document.querySelector('main select#roleid').value;
                let roleIdElement = document.querySelector('main select#roleid');
                roleIdElement.parentNode.removeChild(roleIdElement);
                let idElement = document.querySelector('main div.content-body form#employee-form input[type=hidden]');
                if (idElement != null) {
                    idElement.parentNode.removeChild(idElement);
                }

                //Test if all inputs are filled
                let form = document.querySelector('main div.content-body form#employee-form');
                let stopSave = false;
                for (let index = 0; index < form.length; index++) {
                    if (form[index].value === "") {
                        APPUTIL.es_o.publish_px("alert", ["Es sind nicht alle Felder ausgefüllt."]);
                        stopSave = true;
                        break;
                    }
                }
                if (stopSave) {
                    break;
                }

                let requester_o = new APPUTIL.Requester_cl();
                let formData = new FormData(form);
                let path_s;

                if (roleId === "1") {
                    path_s = "/qsmitarbeiter/";
                } else if (roleId === "2") {
                    path_s = "/swentwickler/"
                } else {
                    break;
                }

                requester_o.post_px(path_s, formData,
                    function (responseText_spl) {
                        let data_o = JSON.parse(responseText_spl);
                        let msg_s = "Mitarbeiter mit der ID: " + data_o['id'] + " erfolgreich erstellt.";
                        APPUTIL.es_o.publish_px("success", [msg_s]);
                        let message = ["list-view", "employee"];
                        message[10] = true;
                        APPUTIL.es_o.publish_px("app.cmd", message);
                    },
                    function (responseText_spl) {
                        let data_o = JSON.parse(responseText_spl);
                        APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                    });
                break;
        }
    }
}