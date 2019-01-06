class Login_cl {
    constructor(element, template) {
        this.template_s = template;
        this.element_s = element;
    }

    render_px() {
        // Delete old login/user cookies
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

        let markup_s = APPUTIL.tm_o.execute_px(this.template_s, '');
        let el_o = document.querySelector(this.element_s);
        if (el_o != null) {
            el_o.innerHTML = markup_s;
            this.configHandleEvent();
        }
    }

    configHandleEvent() {
        let element = document.querySelector('.login-button');
        if (element != null) {
            element.addEventListener('click', this.handleEvent.bind(this));
        }
    }

    handleEvent(event) {
        let username = document.querySelector('.login-input').value;
        if (username.length > 0) {
            //Request RoleID with username
            let path_s = "/login/?username=" + username;
            let requester_o = new APPUTIL.Requester_cl();
            requester_o.get_px(path_s,
                function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    //Save username and roleid in cookies
                    document.cookie = "username=" + data_o['username'] + "; path=/";
                    document.cookie = "role=" + data_o['roleId'] + "; path=/";

                    //Publish the success to app.cmd
                    APPUTIL.es_o.publish_px("app.cmd", ["logged-in", null]);
                }.bind(this), function (responseText_spl) {
                    let data_o = JSON.parse(responseText_spl);
                    APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                });
        } else {
            APPUTIL.es_o.publish_px("alert", ['Der Nutzername darf nicht leer sein!']);
        }
        event.preventDefault();
        event.stopPropagation();
    }
}