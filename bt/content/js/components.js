class Components_cl {
    constructor() {

    }

    render_px() {
        APPUTIL.list_o.render_px("komponenten", null);
    }
}

class ComponentView_cl {
    constructor() {

    }
}

class ComponentEdit_cl {
    constructor() {

    }
}

class ComponentAdd_cl {
    constructor(element, template) {
        this.element_s = element;
        this.template_s = template;
    }
}