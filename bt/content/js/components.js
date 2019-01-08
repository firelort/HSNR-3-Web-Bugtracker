class Components_cl {
    render_px(id) {
        //Request all components
        let requester_o = new APPUTIL.Requester_cl();
        let path_s;

        let firstPromise = new Promise(function (resolve, reject) {
            path_s = "/projekt/";
            requester_o.get_px(path_s,
                function (responseText_spl) {
                    resolve(JSON.parse(responseText_spl));
                }, function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                    reject(data_o['message']);
                });
        });

        if (id == null) {
            path_s = "/komponente/";
        } else {
            path_s = "/projektkomponenten/?id=" + id;
        }
        let secondPromise = new Promise(function (resolve, reject) {
            requester_o.get_px(path_s,
                function (responseText_spl) {
                    resolve(JSON.parse(responseText_spl));
                }, function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                    reject(data_o['message']);
                });
        });


        Promise.all([firstPromise, secondPromise]).then(value => {
            value[2] = id;

            let projectNameArray = [];
            for (let index = 0; index < value[0].length; index++) {
                projectNameArray[value[0][index].id] = value[0][index].name;
            }

            let components = value[1];
            for (let compIndex = 0; compIndex < components.length; compIndex++) {
                value[1][compIndex].project = projectNameArray[value[1][compIndex].project];
            }
            this.doRender(value);
        });


    }

    doRender(data_o) {
        APPUTIL.list_o.render_px("komponente", data_o);
        this.configEventHanlder();
    }

    configEventHanlder() {
        //Handle the Event of the select Button
        let button = document.querySelector("main div.content-body button#selector");
        button.addEventListener('click', this.handleEvent);

        // add eventlistner to buttons
        let buttons = document.querySelectorAll('main div.content-footer button');
        for (let index = 0; index < buttons.length; index++) {
            buttons[index].addEventListener('click', this.handleEventButton);
        }
    }

    handleEvent() {
        let projectID = document.querySelector("main div.content-body select.switch").value;

        if (projectID > 0) {
            // Call the List-View for all components of the project with the given id
            APPUTIL.es_o.publish_px("app.cmd", ["list-view", "komponente", projectID]);
        } else {
            // Call the List-View for all components
            APPUTIL.es_o.publish_px("app.cmd", ["list-view", "komponente"]);
        }
    }

    handleEventButton(event) {
        event.stopPropagation();
        event.preventDefault();
        let selected = document.querySelectorAll("table tbody tr.active");
        let selectedCount = selected.length;
        switch (event.target.dataset.action) {
            case "add":
                APPUTIL.es_o.publish_px("app.cmd", ["add-item", "komponente"]);
                break;
            case "view":
                if (selectedCount !== 1) {
                    APPUTIL.es_o.publish_px("alert", ["Es kann nur genau ein Komponente angesehen werden!"]);
                } else {
                    APPUTIL.es_o.publish_px("app.cmd", ["single-view", "komponente", selected[0].dataset.id]);
                }
                break;
            case "edit":
                if (selectedCount !== 1) {
                    APPUTIL.es_o.publish_px("alert", ["Es kann nur genau ein Komponente bearbeitet werden!"]);
                } else {
                    APPUTIL.es_o.publish_px("app.cmd", ["edit-view", "komponente", selected[0].dataset.id]);
                }
                break;
            case "delete":
                if (selectedCount === 0) {
                    APPUTIL.es_o.publish_px("alert", ["Bitte wählen Sie Komponenten aus die Sie löschen wollen!"]);
                } else {
                    let doit = true;
                    if (selectedCount === 1) {
                        if (!confirm("Wollen Sie die markierte Komponente wirklich löschen?")) {
                            doit = false;
                        }
                    } else {
                        if (!confirm("Wollen Sie die markierten Komponenten wirklich löschen?")) {
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

                        console.log(ids);
                        let path_s = "/komponente/";
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

class ComponentView_cl {
    render_px(id) {
        let requester_o = new APPUTIL.Requester_cl();
        let path_s = "/komponente/?id=" + id;

        let firstPromise = new Promise(function (resolve, reject) {
            requester_o.get_px(path_s,
                function (responseText_spl) {
                    resolve(JSON.parse(responseText_spl));
                }, function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                    reject(data_o['message']);
                });
        });

        path_s = "/projekt/";
        let secondPromise = new Promise(function (resolve, reject) {

            requester_o.get_px(path_s,
                function (responseText_spl) {
                    resolve(JSON.parse(responseText_spl));
                }, function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                    reject(data_o['message']);
                });
        });

        Promise.all([firstPromise, secondPromise]).then(value => {
            console.log(value);
            let component = value[0];
            let projects = value[1];
            for (let index = 0; index < projects.length; index++) {
                if (projects[index].id == component.project) {
                    component.project = {
                        "id": projects[index].id,
                        "name": projects[index].name
                    };
                }
            }
            console.log(component);
            APPUTIL.view_o.render_px("komponente", component);
        });
    }
}

class ComponentEdit_cl {
    render_px(id) {
        let requester_o = new APPUTIL.Requester_cl();
        let path_s = "/projekt/";
        let firstPromise = new Promise(function (resolve, reject) {
            requester_o.get_px(path_s,
                function (responseText_spl) {
                    resolve(JSON.parse(responseText_spl));
                }, function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                    reject(data_o['message']);
                });
        });

        path_s = "/komponente/?id=" + id;
        let secondPromise = new Promise(function (resolve, reject) {
            requester_o.get_px(path_s,
                function (responseText_spl) {
                    resolve(JSON.parse(responseText_spl));
                }, function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                    reject(data_o['message']);
                });
        });

        Promise.all([firstPromise, secondPromise]).then(value => {
            APPUTIL.edit_o.render_px("komponente", value);
        });
    }
}

class ComponentAdd_cl {
    constructor(element, template) {
        this.element_s = element;
        this.template_s = template;
    }

    render_px() {

        let requester_o = new APPUTIL.Requester_cl();
        let path_s = "/projekt/";

        requester_o.get_px(path_s,
            function (responseText_spl) {
                let data_o = JSON.parse(responseText_spl);
                data_o = [data_o, {"type": true, "project": []}];
                console.log(data_o);
                this.doRender(data_o);
            }.bind(this), function (responseText_spl) {
                let data_o = JSON.parse(responseText_spl);
                APPUTIL.es_o.publish_px("alert", [data_o['message']]);
            });
    }

    doRender(data_o) {
        let el_o = document.querySelector(this.element_s);
        if (el_o != null) {
            el_o.innerHTML = APPUTIL.tm_o.execute_px(this.template_s, data_o);
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
                APPUTIL.es_o.publish_px("app.cmd", ["list-view", "komponente"]);
                break;
            case "save":
                let idElement = document.querySelector('main div.content-body form#komponente-form input[type=hidden]');
                if (idElement != null) {
                    idElement.parentNode.removeChild(idElement);
                }

                //Test if all inputs are filled
                let form = document.querySelector('main div.content-body form#komponente-form');
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

                requester_o.post_px("/komponente/", formData,
                    function (responseText_spl) {
                        let data_o = JSON.parse(responseText_spl);
                        let msg_s = "Projekt mit der ID: " + data_o['id'] + " erfolgreich erstellt.";
                        APPUTIL.es_o.publish_px("success", [msg_s]);
                        let message = ["list-view", "komponente"];
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