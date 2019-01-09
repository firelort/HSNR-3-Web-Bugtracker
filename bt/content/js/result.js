class ResultAdd_cl {
    constructor(element, template) {
        this.element_s = element;
        this.template_s = template;
    }

    render_px(errorID) {
        let requester_o = new APPUTIL.Requester_cl();

        // Request the result categories
        let path_s = "/katursache/";
        let categoriePromise = new Promise(function (resolve, reject) {
            requester_o.get_px(path_s,
                function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    resolve(data_o);
                }, function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                    reject(data_o['message']);
                });
        });

        // Request QS-Employee
        path_s = "/swentwickler/";
        let employeePromise = new Promise(function (resolve, reject) {
            requester_o.get_px(path_s,
                function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    resolve(data_o);
                }, function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                    reject(data_o['message']);
                });
        });

        Promise.all([categoriePromise, employeePromise]).then(value => {
            //value[0] -> Alle Lösungs Kategorien
            //value[1] -> Alle Mitarbeiter SE

            console.log(value);
            let data_o = value.concat(errorID);
            console.log(data_o);
            this.doRender(data_o)
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
                APPUTIL.es_o.publish_px("app.cmd", ["list-view", "fehler"]);
                break;
            case "save":
                let errrorID = document.querySelector('main div.content-body form#result-form input[type=hidden]').value;

                //Test if all inputs are filled
                let form = document.querySelector('main div.content-body form#result-form');
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

                requester_o.post_px("/loesung/", formData,
                    function (responseText_spl) {
                        let data_o = JSON.parse(responseText_spl);
                        let msg_s = "Fehler mit der ID: " + data_o['id'] + " erfolgreich erstellt.";
                        APPUTIL.es_o.publish_px("success", [msg_s]);
                        let message = ["list-view", "fehler"];
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

class ResultEdit_cl {
    startRequest(id) {
        let requester_o = new APPUTIL.Requester_cl();

        let formData = new FormData;
        formData.append("id", id);

        requester_o.put_px("/loesung/", formData,
            function (responseText_spl) {
                let data_o = JSON.parse(responseText_spl);
                APPUTIL.es_o.publish_px("success", [data_o['message']]);
                let message = ["list-view", "fehler"];
                APPUTIL.es_o.publish_px("app.cmd", message);
            }.bind(this),
            function (responseText_spl) {
                let data_o = JSON.parse(responseText_spl);
                APPUTIL.es_o.publish_px("alert", [data_o['message']]);
            });
    }
}