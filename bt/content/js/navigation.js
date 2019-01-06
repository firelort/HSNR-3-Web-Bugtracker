class Navigation_cl {
    constructor(element, template) {
        this.element_s = element;
        this.template_s = template;
    }

    render_px() {
        //Request the sidebar
        let cookies = document.cookie.split("; ");
        let i;
        let roleId;
        for (i = 0; i < cookies.length; i++) {
            let key = cookies[i].split("=");
            if (key[0] === "role") {
                roleId = key[1];
                break;
            }
        }
        if (roleId === undefined) {
            APPUTIL.es_o.publish_px("alert", ["Es ist ein Fehler mit den Cookies aufgetretten!"]);
        } else {
            let path_s = "/nav/?roleId=" + roleId;
            let requester_o = new APPUTIL.Requester_cl();
            requester_o.get_px(path_s,
                function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    this.doRender_p(data_o)
                }.bind(this), function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                });
        }
    }

    doRender_p(data_opl) {
        //Render the sidebar with the given data
        let markup_s = APPUTIL.tm_o.execute_px(this.template_s, data_opl);
        let el_o = document.querySelector(this.element_s);
        if (el_o != null) {
            el_o.innerHTML = markup_s;
            this.configHandleEvent();
        }
    }

    configHandleEvent() {
        let element = document.querySelector(this.element_s);
        if (element != null) {
            element.addEventListener("click", this.handleEvent);
        }
    }

    handleEvent(event_opl) {
        let type = event_opl.target.dataset.action;
        let cmd_s = event_opl.target.dataset.target;
        APPUTIL.es_o.publish_px("app.cmd", [type, cmd_s]);
    }
}