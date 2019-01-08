class Projects_cl {
    render_px() {
        // Request the projectlist
        let path_s = "/projekt/";
        let requester_o = new APPUTIL.Requester_cl();

        requester_o.get_px(path_s, function (responseText_spl) {
            let data_o = JSON.parse(responseText_spl);
            this.doRender_p(data_o);
        }.bind(this), function (responseText_spl) {
            let data_o = JSON.parse(responseText_spl);
            APPUTIL.es_o.publish_px("app.cmd", ["home", null]);
            APPUTIL.es_o.publish_px("alert", [data_o['message']]);
        })
    }

    doRender_p(data_opl) {
        APPUTIL.list_o.render_px("projekt", data_opl);
        this.configHandleEvent();
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

        console.log(selectedCount, selected);

        switch (event.target.dataset.action) {
            case "add":
                APPUTIL.es_o.publish_px("app.cmd", ["add-item", "projekt"]);
                break;
            case "view":
                if (selectedCount !== 1) {
                    APPUTIL.es_o.publish_px("alert", ["Es kann nur genau ein Projekt angesehen werden!"]);
                } else {
                    APPUTIL.es_o.publish_px("app.cmd", ["single-view", "projekt", selected[0].dataset.id]);
                }
                break;
            case "edit":
                if (selectedCount !== 1) {
                    APPUTIL.es_o.publish_px("alert", ["Es kann nur genau ein Projekt bearbeitet werden!"]);
                } else {
                    APPUTIL.es_o.publish_px("app.cmd", ["edit-view", "projekt", selected[0].dataset.id]);
                }
                break;
            case "delete":
                if (selectedCount === 0) {
                    APPUTIL.es_o.publish_px("alert", ["Bitte wählen Sie Projekte aus die Sie löschen wollen!"]);
                } else {
                    let doit = true;
                    if (selectedCount === 1) {
                        if (!confirm("Wollen Sie das markierte Projekt wirklich löschen?")) {
                            doit = false;
                        }
                    } else {
                        if (!confirm("Wollen Sie die markierten Projekte wirklich löschen?")) {
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

                        let path_s = "/projekt/";
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
                                APPUTIL.es_o.publish_px("alert", [(data_o['message'] + "<br /> Bitte laden Sie die Seite neu.")]);
                            });
                    }
                }
                break;
        }
    }
}

class ProjectView_cl {
    constructor() {
        this.done = [false, false];
        this.error = false;
        this.project_o = null;
        this.comp_o = null;
    }

    saveProject(data_o) {
        this.project_o = data_o;
        this.done[0] = true;
    }

    saveComp(data_o) {
        this.comp_o = data_o;
        this.done[1] = true;
    }

    render_px(id) {
        this.done = [false, false];
        this.error = false;

        let requester_o = new APPUTIL.Requester_cl();
        requester_o.get_px("/projekt/?id=" + id, function (responseText_spl) {
            let data_o = JSON.parse(responseText_spl);
            this.saveProject(data_o);
        }.bind(this), function (responseText_spl) {
            let data_o = JSON.parse(responseText_spl);
            this.error = true;
            APPUTIL.es_o.publish_px("alert", [data_o['message']]);
        }.bind(this));

        requester_o.get_px("/projektkomponenten/?id=" + id, function (responseText_spl) {
            let data_o = JSON.parse(responseText_spl);
            this.saveComp(data_o);
        }.bind(this), function (responseText_spl) {
            let data_o = JSON.parse(responseText_spl);
            this.error = true;
            APPUTIL.es_o.publish_px("alert", [data_o['message']]);
        }.bind(this));

        //Wait for the requested data
        return setTimeout(function () {
            return this.isAllDataAv();
        }.bind(this), 1);
    }

    isAllDataAv() {
        if (this.error !== true) {
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
        let data_o = this.project_o;

        let index, secindex;

        for (index = 0; index < data_o.length; index++) {
            for (secindex = 0; secindex < this.comp_o.length; secindex++) {
                if (this.comp_o[secindex].id === data_o.components[index]) {
                    data_o.components[index] = {
                        "id": this.comp_o[secindex].id,
                        "name": this.comp_o[secindex].name,
                        "desc": this.comp_o[secindex].desc
                    };
                    break;
                }
            }
        }

        console.log(data_o);
        //Render the thing
        APPUTIL.view_o.render_px("projekt", data_o, null);
    }


}

class ProjectEdit_cl {
    render_px(id) {
        let requester_o = new APPUTIL.Requester_cl();
        requester_o.get_px("/projekt/?id=" + id,
            function (responseText_spl) {
                let data_o = JSON.parse(responseText_spl);
                console.log(data_o);
                APPUTIL.edit_o.render_px("projekt", data_o, null);
            }, function (responseText_spl) {
                let data_o = JSON.parse(responseText_spl);
                APPUTIL.es_o.publish_px("alert", [data_o['message']]);
            });
    }
}

class ProjectAdd_cl {
    constructor(element, template) {
        this.element_s = element;
        this.templates_s = template;
    }

    render_px() {
        let el_o = document.querySelector(this.element_s);
        if (el_o != null) {
            el_o.innerHTML = APPUTIL.tm_o.execute_px(this.templates_s, null);
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
                APPUTIL.es_o.publish_px("app.cmd", ["list-view", "projekt"]);
                break;
            case "save":
                let idElement = document.querySelector('main div.content-body form#employee-form input[type=hidden]');
                if (idElement != null) {
                    idElement.parentNode.removeChild(idElement);
                }

                //Test if all inputs are filled
                let form = document.querySelector('main div.content-body form#projekt-form');
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

                requester_o.post_px("/projekt/", formData,
                    function (responseText_spl) {
                        let data_o = JSON.parse(responseText_spl);
                        let msg_s = "Projekt mit der ID: " + data_o['id'] + " erfolgreich erstellt.";
                        APPUTIL.es_o.publish_px("success", [msg_s]);
                        let message = ["list-view", "projekt"];
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