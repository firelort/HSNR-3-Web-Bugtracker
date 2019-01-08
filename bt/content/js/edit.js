class Edit_cl {
    constructor(element) {
        this.element_s = element;
        this.endpoint = null;
        this.type = null
    }

    render_px(template_s, data_o, additionInfo) {
        if (template_s === "employee" || template_s === "category") {
            this.endpoint = additionInfo;
        } else {
            this.endpoint = template_s;
        }
        this.type = template_s;
        let path_s = template_s + "-edit.tpl.html";
        let el_o = document.querySelector(this.element_s);
        if (el_o != null) {
            el_o.innerHTML = APPUTIL.tm_o.execute_px(path_s, data_o);
            this.configHandleEvent();
        }
    }

    configHandleEvent() {
        let buttons = document.querySelectorAll('main div.content-footer button');
        let index;
        for (index = 0; index < buttons.length; index++) {
            buttons[index].addEventListener('click', this.handleEvent.bind(this));
        }
    }

    handleEvent(event) {
        event.stopPropagation();
        event.preventDefault();

        switch (event.target.dataset.action) {
            case "cancel":
                APPUTIL.es_o.publish_px("app.cmd", ["list-view", this.type]);
                break;
            case "save":
                //Test if all inputs are filled
                let form = document.querySelector('main div.content-body form');
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

                requester_o.put_px("/" + this.endpoint + "/", formData,
                    function (responseText_spl) {
                        let data_o = JSON.parse(responseText_spl);
                        APPUTIL.es_o.publish_px("success", [data_o['message']]);
                        let message = ["list-view", this.type];
                        message[10] = true;
                        APPUTIL.es_o.publish_px("app.cmd", message);
                    }.bind(this),
                    function (responseText_spl) {
                        let data_o = JSON.parse(responseText_spl);
                        APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                    });
                break;
        }
    }
}