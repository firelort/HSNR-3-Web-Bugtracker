class Header_cl {
    constructor(element, template) {
        this.element_s = element;
        this.template_s = template;
    }

    render_px (data_opl) {
      let markup_s = APPUTIL.tm_o.execute_px(this.template_s, data_opl);
      let element_o = document.querySelector(this.element_s);
      if (element_o != null) {
         element_o.innerHTML = markup_s;
      }
   }

}