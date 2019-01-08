class View_cl {
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
        let path_s = template_s + "-view.tpl.html";
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
            buttons[index].addEventListener('click', this.handleEventButton.bind(this));
        }
    }

    handleEventButton(event) {
        event.stopPropagation();
        event.preventDefault();
        switch (event.target.dataset.action) {
            case "edit":
                //Request Single View
                APPUTIL.es_o.publish_px("app.cmd", ["edit-view", this.type, document.querySelector('main div.content-footer').dataset.id, document.querySelector('main div.content-footer').dataset.roleid]);
                break;
            case "delete":
                if (confirm("Wollen Sie den Eintrag wirklich löschen?")) {
                    let id = document.querySelector('main div.content-footer').dataset.id;
                    let requester_o = new APPUTIL.Requester_cl();
                    let path_s = "/" + this.endpoint + "/";
                    requester_o.delete_px(path_s, [id],
                        function (responseText_spl) {
                            APPUTIL.es_o.publish_px("app.cmd", ["list-view", this.type]);
                        }.bind(this), function (responseText_spl) {
                            let data_o = JSON.parse(responseText_spl);
                            APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                        });
                }
                break;
            default:
                break;
        }
    }
}