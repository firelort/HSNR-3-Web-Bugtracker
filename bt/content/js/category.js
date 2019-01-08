class Categories_cl {
    render_px() {
        let requester_o = new APPUTIL.Requester_cl();
        let path_s = "/katfehler/";

        let errorPromise = new Promise(function (resolve, reject) {
            requester_o.get_px(path_s,
                function (responseText_spl) {
                    resolve(JSON.parse(responseText_spl));
                }, function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                    reject(data_o['message']);
                });
        });

        path_s = "/katursache/";
        let resultPromise = new Promise(function (resolve, reject) {
            requester_o.get_px(path_s,
                function (responseText_spl) {
                    resolve(JSON.parse(responseText_spl));
                }, function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                    reject(data_o['message']);
                });
        });
        Promise.all([errorPromise, resultPromise]).then(value => {
            value[0].forEach(function (entry) {
                entry.type = "Fehler";
                entry.roleid = 1;
            });

            value[1].forEach(function (entry) {
                entry.type = "Lösung";
                entry.roleid = 2;
            });
            let data_o = value[0].concat(value[1]);
            this.doRender(data_o);
        });
    }

    doRender(data_o) {
        APPUTIL.list_o.render_px("category", data_o);
        this.configEventHanlder();
    }

    configEventHanlder() {
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
                APPUTIL.es_o.publish_px("app.cmd", ["add-item", "category"]);
                break;
            case "view":
                if (selectedCount !== 1) {
                    APPUTIL.es_o.publish_px("alert", ["Es kann nur genau ein Kategorie angesehen werden!"]);
                } else {
                    APPUTIL.es_o.publish_px("app.cmd", ["single-view", "category", selected[0].dataset.id, selected[0].dataset.roleid]);
                }
                break;
            case "edit":
                if (selectedCount !== 1) {
                    APPUTIL.es_o.publish_px("alert", ["Es kann nur genau ein Kategorie bearbeitet werden!"]);
                } else {
                    APPUTIL.es_o.publish_px("app.cmd", ["edit-view", "category", selected[0].dataset.id, selected[0].dataset.roleid]);
                }
                break;
            case "delete":
                if (selectedCount === 0) {
                    APPUTIL.es_o.publish_px("alert", ["Bitte wählen Sie Kategorien aus die Sie löschen wollen!"]);
                } else {
                    let doit = true;
                    if (selectedCount === 1) {
                        if (!confirm("Wollen Sie die markierte Kategorie wirklich löschen?")) {
                            doit = false;
                        }
                    } else {
                        if (!confirm("Wollen Sie die markierten Kategorien wirklich löschen?")) {
                            doit = false;
                        }
                    }
                    if (doit) {
                        //Request Delete of given Employees
                        let idsError = []; //Int array
                        let idsResult = [];
                        let index;
                        for (index = 0; index < selectedCount; index++) {
                            if (selected[index].dataset.roleid === "1") {
                                idsError.push(parseInt(selected[index].dataset.id, 10))
                            } else if (selected[index].dataset.roleid === "2") {
                                idsResult.push(parseInt(selected[index].dataset.id, 10))
                            }
                        }


                        let requester_o = new APPUTIL.Requester_cl();

                        let path_s = "/katfehler/";
                        let errorPromise = new Promise(function (resolve, reject) {
                            if (idsError.length < 1) {
                                resolve();
                            } else {
                                console.log("Error:", idsError);
                                requester_o.delete_px(path_s, idsError,
                                    function (responseText_spl) {
                                        let data_o = JSON.parse(responseText_spl);
                                        APPUTIL.es_o.publish_px("success", [data_o['message']]);
                                        resolve();
                                    }, function (responseText_spl) {
                                        let data_o = JSON.parse(responseText_spl);
                                        APPUTIL.es_o.publish_px("alert", [(data_o['message'] + "<br /> Bitte laden Sie die Kategorieliste neu.")]);
                                        reject(data_o['message']);
                                    });
                            }
                        });

                        errorPromise.then(function () {
                            path_s = "/katursache/";
                            let resultPromise = new Promise(function (resolve, reject) {
                                if (idsResult.length < 1) {
                                    resolve();
                                } else {
                                    console.log("Lösung:", idsResult);
                                    requester_o.delete_px(path_s, idsResult,
                                        function (responseText_spl) {
                                            let data_o = JSON.parse(responseText_spl);
                                            APPUTIL.es_o.publish_px("success", [data_o['message']]);
                                            resolve();
                                        }, function (responseText_spl) {
                                            let data_o = JSON.parse(responseText_spl);
                                            APPUTIL.es_o.publish_px("alert", [(data_o['message'] + "<br /> Bitte laden Sie die Kategorieliste neu.")]);
                                            reject(data_o['message']);
                                        });
                                }
                            });

                            resultPromise.then(function () {
                                //Remove the entries from the table
                                for (index = 0; index < selectedCount; index++) {
                                    selected[index].parentNode.removeChild(selected[index]);
                                }
                            })
                        });
                    }
                }
                break;
        }
    }
}

class CategoryView_cl {
    render_px(id, type) {
        let requester_o = new APPUTIL.Requester_cl();
        let path_s;
        let typeName;
        let done = false;
        if (type === "1") {
            path_s = "katfehler";
            typeName = "Fehler";
        } else if (type === "2") {
            path_s = "katursache";
            typeName = "Lösung";
        } else {
            done = true;
        }

        if (!done) {
            requester_o.get_px("/" + path_s + "/?id=" + id,
                function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    data_o.type = typeName;
                    data_o.roleid = type;
                    console.log(data_o);
                    APPUTIL.view_o.render_px("category", data_o, path_s);
                }.bind(this), function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                });
        }
    }
}

class CategoryEdit_cl {
    render_px(id, type) {
        let requester_o = new APPUTIL.Requester_cl();
        let done = false;
        let path_s;
        if (type === "1") {
            path_s = "katfehler";
        } else if (type === "2") {
            path_s = "katursache";
        } else {
            done = true;
        }

        if (!done) {
            requester_o.get_px("/" + path_s + "/?id=" + id,
                function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    console.log(data_o);
                    APPUTIL.edit_o.render_px("category", data_o, path_s);
                }, function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                });
        }
    }
}

class CategoryAdd_cl {
    constructor(element, template) {
        this.element_s = element;
        this.template_s = template;
    }

    render_px() {
        let el_o = document.querySelector(this.element_s);
        if (el_o != null) {
            el_o.innerHTML = APPUTIL.tm_o.execute_px(this.template_s, null);
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
                APPUTIL.es_o.publish_px("app.cmd", ["list-view", "category"]);
                break;
            case "save":

                //Test if all inputs are filled
                let form = document.querySelector('main div.content-body form#category-form');
                let stopSave = false;
                for (let index = 0; index < form.length; index++) {
                    if (form[index].value === "") {
                        APPUTIL.es_o.publish_px("alert", ["Es sind nicht alle Felder ausgefüllt."]);
                        stopSave = true;
                        break;
                    }
                }

                let type = form.querySelector("select").value;
                let path_s;
                if (type === "1") {
                    path_s = "katfehler";
                } else if (type === "2") {
                    path_s = "katursache";
                } else {
                    stop = true;
                }

                if (stopSave) {
                    break;
                }

                let requester_o = new APPUTIL.Requester_cl();

                let formData = new FormData(form);

                requester_o.post_px("/" + path_s + "/", formData,
                    function (responseText_spl) {
                        let data_o = JSON.parse(responseText_spl);
                        let msg_s = path_s + " mit der ID: " + data_o['id'] + " erfolgreich erstellt.";
                        APPUTIL.es_o.publish_px("success", [msg_s]);
                        let message = ["list-view", "category"];
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