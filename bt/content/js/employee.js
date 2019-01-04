class Employee_cl {
    constructor(element, template) {
        this.template_s = template;
        this.element_s = element;
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
                APPUTIL.es_o.publish_px("app.cmd", ["alert", data_o['message']]);
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
                APPUTIL.es_o.publish_px("app.cmd", ["alert", data_o['message']]);
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
                APPUTIL.es_o.publish_px("app.cmd", ["alert", data_o['message']]);
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
            let markup_s = APPUTIL.tm_o.execute_px(this.template_s, data_o);
            let el_o = document.querySelector(this.element_s);
            if (el_o != null) {
                el_o.innerHTML = markup_s;
                this.configHandleEvent();
            }

        } else {
            APPUTIL.es_o.publish_px("app.cmd", ["home", null]);
            APPUTIL.es_o.publish_px("app.cmd", ["alert", "Es ist ein Fehler mit den Rollen aufgetreten."]);
        }
    }

    configHandleEvent() {
        // add &#8597; to the heading and add eventlistner for sorting
        let headRow = document.querySelector('thead.table-head').querySelector('tr');
        let index;
        for (index = 0; index < 3; index++) {
            let element = headRow.querySelectorAll("th")[index];
            element.classList.add('clickable');
            element.dataset.target = index;
            element.insertAdjacentHTML('beforeend', " &#8597;");
            element.addEventListener('click', this.handleEventHeader);
        }

        // add eventlistner to rows
        let bodyRows = document.querySelectorAll('table#employee-list tbody.table-body tr');

        for (index = 0; index < bodyRows.length; index++) {
            bodyRows[index].addEventListener('click', this.handleEventContent);
        }

        let buttons = document.querySelectorAll('main div.content-footer button');
        for (index = 0; index < buttons.length; index++) {
            buttons[index].addEventListener('click', this.handleEventButton);
        }
    }

    handleEventHeader(event) {
        let choice = event.srcElement.dataset.target;
        var tbody, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        tbody = document.querySelector("tbody.table-body");
        switching = true;
        // Set the sorting direction to ascending:
        dir = "asc";
        // Make a loop that will continue until no switching has been done
        while (switching) {
            // Start by saying: no switching is done:
            switching = false;
            rows = tbody.rows;
            // Loop through all table rows
            for (i = 0; i < (rows.length - 1); i++) {
                // Start by saying there should be no switching:
                shouldSwitch = false;
                // two elements compare, current and next row
                x = rows[i].getElementsByTagName("td")[choice];
                y = rows[i + 1].getElementsByTagName("td")[choice];
                // Check if the two rows should switch place, based on the direction, asc or desc: */
                if (dir == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                // If a switch has been marked, make the switch and mark that a switch has been done
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                // Each time a switch is done, increase this count by 1:
                switchcount++;
            } else {
                // If no switching has been done AND the direction is "asc", set the direction to "desc" and run the while loop again.
                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    }

    handleEventContent(event) {
        let element = event.target.parentNode;
        if (element.classList.contains("active")) {
            element.classList.remove("active");
        } else {
            element.classList.add("active");
        }

        //Check how much rows are active
        let activeRows = document.querySelectorAll("table tbody tr.active").length;
        let buttons = document.querySelectorAll('main div.content-footer button');
        let index;
        switch (activeRows) {
            case 0:
                for (index = 1; index < buttons.length; index++) {
                    buttons[index].classList.add('disabled');
                    buttons[index].setAttribute('disabled', '');
                }
                break;
            case 1:
                for (index = 1; index < buttons.length; index++) {
                    buttons[index].classList.remove('disabled');
                    buttons[index].removeAttribute('disabled');
                }
                break;
            default:
                for (index = 1; index < (buttons.length - 1); index++) {
                    buttons[index].classList.add('disabled');
                    buttons[index].setAttribute('disabled', '');
                }
                break;
        }

        event.stopPropagation();
        event.preventDefault();
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
                    APPUTIL.es_o.publish_px("app.cmd", ["alert", "Es kann nur genau ein Mitarbeiter angesehen werden!"]);
                } else {
                    APPUTIL.es_o.publish_px("app.cmd", ["single-view", "employee", selected[0].dataset.userid, selected[0].dataset.roleid]);
                }
                break;
            case "edit":
                if (selectedCount !== 1) {
                    APPUTIL.es_o.publish_px("app.cmd", ["alert", "Es kann nur genau ein Mitarbeiter bearbeitet werden!"]);
                } else {
                    APPUTIL.es_o.publish_px("app.cmd", ["edit-view", "employee", selected[0].dataset.userid, selected[0].dataset.roleid]);
                }
                break;
            case "delete":
                if (selectedCount === 0) {
                    APPUTIL.es_o.publish_px("app.cmd", ["alert", "Bitte wählen Sie Mitarbeiter aus die Sie löschen wollen!"]);
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
                            ids.push(parseInt(selected[index].dataset.userid, 10))
                        }

                        let path_s = "/employee/";
                        let requester_o = new APPUTIL.Requester_cl();
                        requester_o.delete_px(path_s, ids,
                            function (responseText_spl) {
                                let data_o = JSON.parse(responseText_spl);
                                APPUTIL.es_o.publish_px("app.cmd", ["success", data_o['message']]);

                                //Remove the entries from the table
                                for (index = 0; index < selectedCount; index++) {
                                    selected[index].parentNode.removeChild(selected[index]);
                                }

                            }, function (responseText_spl) {
                                let data_o = JSON.parse(responseText_spl);
                                APPUTIL.es_o.publish_px("app.cmd", ["alert", (data_o['message'] + "<br /> Bitte laden Sie die Mitarbeiterliste neu.")]);
                            });
                    }
                }
                break;
            default:
                break;
        }
    }
}

class EmployeeView_cl {
    constructor(element, template) {
        this.element_s = element;
        this.template_s = template;
    }

    render_px(userid, roleid) {
        let finished = false;
        let role;
        let path_s;
        if (roleid === "1") {
            path_s = "/qsmitarbeiter/";
            role = "QS-Mitarbeiter";
        } else if (roleid === "2") {
            path_s = "/swentwickler/";
            role = "SE-Mitarbeiter";
        } else {
            APPUTIL.es_o.publish_px("app.cmd", ["alert", "Diese Rolle existiert nicht."]);
            finished = true;
        }
        if (!finished) {
            let requester_o = new APPUTIL.Requester_cl();
            requester_o.get_px(path_s,
                function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    data_o[0]['roleName'] = role;
                    this.doRender_p(data_o);
                }.bind(this), function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    APPUTIL.es_o.publish_px("app.cmd", ["alert", data_o['message']]);
                });
        }
    }

    doRender_p(data_opl) {
        let markup_s = APPUTIL.tm_o.execute_px(this.template_s, data_opl);
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
            buttons[index].addEventListener('click', this.handleEventButton);
        }
    }

    handleEventButton(event) {
        event.stopPropagation();
        event.preventDefault();
        switch (event.target.dataset.action) {
            case "edit":
                //Request Single View
                APPUTIL.es_o.publish_px("app.cmd", ["edit-view", "employee", document.querySelector('main div.content-footer').dataset.userid, document.querySelector('main div.content-footer').dataset.roleid]);
                break;
            case "delete":
                if (confirm("Wollen Sie Mitarbeiter wirklich löschen?")) {
                    let path_s;
                    let roleid = document.querySelector('main div.content-footer').dataset.roleid;
                    let userid = document.querySelector('main div.content-footer').dataset.userid;
                    if (roleid === "1") {
                        path_s = "/qsmitarbeiter/"
                    } else if (roleid === "2") {
                        path_s = "/swentwickler/"
                    } else {
                        break;
                    }
                    let requester_o = new APPUTIL.Requester_cl();
                    requester_o.delete_px(path_s, [userid],
                        function (responseText_spl) {
                            let data_o = JSON.parse(responseText_spl);
                            APPUTIL.es_o.publish_px("app.cmd", ["all-employees", null]); //-> geht nicht, ist zu schnell, es wird auch noch der gelöschte Mitarbeiter geladen
                            //APPUTIL.es_o.publish_px("app.cmd", ["home", null]);
                        }, function (responseText_spl) {
                            let data_o = JSON.parse(responseText_spl);
                            APPUTIL.es_o.publish_px("app.cmd", ["alert", data_o['message']]);
                        });
                }
                break;
            default:
                break;
        }
    }
}

class EmployeeEdit_cl {
    constructor(element, template) {
        this.element_s = element;
        this.templates_s = template;
        this.user_o = null;
        this.role_o = null;
        this.done = [false, false];
        this.error = false;
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
        let finished = false;
        let path_s;
        if (roleid === "1") {
            path_s = "/qsmitarbeiter/";
        } else if (roleid === "2") {
            path_s = "/swentwickler/";
        } else {
            APPUTIL.es_o.publish_px("app.cmd", ["alert", "Diese Rolle existiert nicht."]);
            finished = true;
        }

        if (!finished) {
            let requester_o = new APPUTIL.Requester_cl();
            requester_o.get_px(path_s,
                function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    this.saveUser(data_o);
                }.bind(this), function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    APPUTIL.es_o.publish_px("app.cmd", ["alert", data_o['message']]);
                    this.error = true;
                }.bind(this));

            path_s = "/role/";
            requester_o.get_px(path_s,
                function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    this.saveRole(data_o);
                }.bind(this), function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    APPUTIL.es_o.publish_px("app.cmd", ["alert", data_o['message']]);
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
        let userData_o = this.user_o.concat(this.role_o);

        //Render the content with the given data
        let markup_s = APPUTIL.tm_o.execute_px(this.templates_s, userData_o);
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
                APPUTIL.es_o.publish_px("app.cmd", ["all-employees"]);
                break;
            case "save":
                let requester_o = new APPUTIL.Requester_cl();
                let roleId = document.querySelector('main select#roleid').value;
                let formData = new FormData(document.querySelector('main div.content-body form#employee-form'));
                let path_s;

                if (roleId === "1") {
                    path_s = "/qsmitarbeiter/";
                } else if (roleId === "2") {
                    path_s = "/swentwickler/"
                } else {
                    break;
                }

                requester_o.put_px(path_s, formData,
                    function (responseText_spl) {
                        let data_o = JSON.parse(responseText_spl);
                        APPUTIL.es_o.publish_px("app.cmd", ["success", data_o['message']]);
                        APPUTIL.es_o.publish_px("app.cmd", ["all-employees"]);
                    },
                    function (responseText_spl) {
                        let data_o = JSON.parse(responseText_spl);
                        APPUTIL.es_o.publish_px("app.cmd", ["alert", data_o['message']]);
                    });
                break;
        }
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
            APPUTIL.es_o.publish_px("app.cmd", ["alert", data_o['message']]);
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
                APPUTIL.es_o.publish_px("app.cmd", ["all-employees"]);
                break;
            case "save":
                let requester_o = new APPUTIL.Requester_cl();
                let roleId = document.querySelector('main select#roleid').value;
                let roleIdElement = document.querySelector('main select#roleid');
                roleIdElement.parentNode.removeChild(roleIdElement);
                let idElement = document.querySelector('main div.content-body form#employee-form input[type=hidden]');
                idElement.parentNode.removeChild(idElement);
                let formData = new FormData(document.querySelector('main div.content-body form#employee-form'));
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
                        APPUTIL.es_o.publish_px("app.cmd", ["success", msg_s]);
                        APPUTIL.es_o.publish_px("app.cmd", ["all-employees"]);
                    },
                    function (responseText_spl) {
                        let data_o = JSON.parse(responseText_spl);
                        APPUTIL.es_o.publish_px("app.cmd", ["alert", data_o['message']]);
                    });
                break;
        }
    }
}