class Employee_cl {
    constructor(element, template) {
        this.template_s = template;
        this.element_s = element;
        this.swData_o = null;
        this.qsData_o = null;
        this.role_o = null;
        this.done = [false, false, false];
        this.error = false;
    }

    saveSw(data_o) {
        this.swData_o = data_o;
        this.done[0] = true;
    }

    saveQs(data_o) {
        this.qsData_o = data_o;
        this.done[1] = true;
    }

    saveRole(data_o) {
        this.role_o = data_o;
        this.done[2] = true;
    }

    render_px() {

        //Request the sw employee list
        let path_s = "/swentwickler/";
        let requester_o = new APPUTIL.Requester_cl();
        var qsData_o;
        requester_o.get_px(path_s,
            function (responseText_spl) {
                this.saveSw(JSON.parse(responseText_spl));
            }.bind(this), function (responseText_spl) {
                let data_o = JSON.parse(responseText_spl);
                APPUTIL.es_o.publish_px("app.cmd", ["home", null]);
                APPUTIL.es_o.publish_px("app.cmd", ["alert", data_o['message']]);
                this.error = true;
            }.bind(this));

        //Request the qs employee list
        path_s = "/qsmitarbeiter/";
        requester_o.get_px(path_s,
            function (responseText_spl) {
                this.saveQs(JSON.parse(responseText_spl));
            }.bind(this), function (responseText_spl) {
                let data_o = JSON.parse(responseText_spl);
                APPUTIL.es_o.publish_px("app.cmd", ["home", null]);
                APPUTIL.es_o.publish_px("app.cmd", ["alert", data_o['message']]);
                this.error = true;
            }.bind(this));

        //Request the role list
        path_s = "/role/";
        requester_o.get_px(path_s,
            function (responseText_spl) {
                this.saveRole(JSON.parse(responseText_spl));
            }.bind(this), function (responseText_spl) {
                let data_o = JSON.parse(responseText_spl);
                APPUTIL.es_o.publish_px("app.cmd", ["home", null]);
                APPUTIL.es_o.publish_px("app.cmd", ["alert", data_o['message']]);
                this.error = true;
            }.bind(this));

        //Wait for the requested data
        return setTimeout(function () {
            return this.isAllDataAv();
        }.bind(this), 1);
    }

    isAllDataAv() {
        if (this.error !== true) {
            if (this.done[0] === true && this.done[1] === true && this.done[2] === true) {
                this.doRender_p();
            } else {
                return setTimeout(function () {
                    return this.isAllDataAv();
                }.bind(this), 1);
            }
        }
    }

    doRender_p() {
        //Change the content of 'role' to the role name
        if (this.role_o !== null && this.role_o.length > 1) {
            let newSwData_o = this.swData_o;
            let newQsData_o = this.qsData_o;
            let index;

            for (index = 0; index < newSwData_o.length; index++) {
                newSwData_o[index]['roleName'] = this.role_o[1]['desc'];
            }

            for (index = 0; index < newQsData_o.length; index++) {
                newQsData_o[index]['roleName'] = this.role_o[0]['desc'];
            }

            let data_o = newSwData_o.concat(newQsData_o);
            //Render the content with the given data
            let markup_s = APPUTIL.tm_o.execute_px(this.template_s, data_o);
            let el_o = document.querySelector(this.element_s);
            if (el_o != null) {
                el_o.innerHTML = markup_s;
                this.configHandleEvent();
            }

        } else {
            APPUTIL.es_o.publish_px("app.cmd", ["home", null]);
            APPUTIL.es_o.publish_px("app.cmd", ["alert", "Es ist ein Fehler mit den Rollen aufgetreten."]);
        }
    }

    configHandleEvent() {
        // add &#8597; to the heading and add eventlistner for sorting
        let headRow = document.querySelector('thead.table-head').querySelector('tr');
        let index;
        for (index = 0; index < 3; index++) {
            let element = headRow.querySelectorAll("th")[index];
            element.classList.add('clickable');
            element.dataset.target = index;
            element.insertAdjacentHTML('beforeend', " &#8597;");
            element.addEventListener('click', this.handleEventHeader);
        }

        // add eventlistner to rows
        let bodyRows = document.querySelectorAll('table#employee-list tbody.table-body tr');

        for (index = 0; index < bodyRows.length; index++) {
            bodyRows[index].addEventListener('click', this.handleEventContent);
        }

        let buttons = document.querySelectorAll('main div.content-footer button');
        for (index = 0; index < buttons.length; index++) {
            buttons[index].addEventListener('click', this.handleEventButton);
        }
    }

    handleEventHeader(event) {
        let choice = event.srcElement.dataset.target;
        let n = choice;
        var tbody, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        tbody = document.querySelector("tbody.table-body");
        switching = true;
        // Set the sorting direction to ascending:
        dir = "asc";
        /* Make a loop that will continue until
        no switching has been done: */
        while (switching) {
            // Start by saying: no switching is done:
            switching = false;
            rows = tbody.rows;
            /* Loop through all table rows (except the
            first, which contains table headers): */
            for (i = 0; i < (rows.length - 1); i++) {
                // Start by saying there should be no switching:
                shouldSwitch = false;
                /* Get the two elements you want to compare,
                one from current row and one from the next: */
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
                /* Check if the two rows should switch place,
                based on the direction, asc or desc: */
                if (dir == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                /* If a switch has been marked, make the switch
                and mark that a switch has been done: */
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                // Each time a switch is done, increase this count by 1:
                switchcount++;
            } else {
                /* If no switching has been done AND the direction is "asc",
                set the direction to "desc" and run the while loop again. */
                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    }

    handleEventContent(event) {
        let element = event.target.parentNode;
        if (element.classList.contains("active")) {
            element.classList.remove("active");
        } else {
            element.classList.add("active");
        }

        //Check how much rows are active
        let activeRows = document.querySelectorAll("table tbody tr.active").length;
        let buttons = document.querySelectorAll('main div.content-footer button');
        let index;
        switch (activeRows) {
            case 0:
                for (index = 1; index < buttons.length; index++) {
                    buttons[index].classList.add('disabled');
                    buttons[index].setAttribute('disabled', '');
                }
                break;
            case 1:
                for (index = 1; index < buttons.length; index++) {
                    buttons[index].classList.remove('disabled');
                    buttons[index].removeAttribute('disabled');
                }
                break;
            default:
                for (index = 1; index < (buttons.length - 1); index++) {
                    buttons[index].classList.add('disabled');
                    buttons[index].setAttribute('disabled', '');
                }
                break;
        }

        event.stopPropagation();
        event.preventDefault();
    }

    handleEventButton(event) {
        event.stopPropagation();
        event.preventDefault();
        let selected = document.querySelectorAll("table tbody tr.active");
        let selectedCount = selected.length;
        switch (event.target.dataset.action) {
            case "add":
                alert("add");
                break;
            case "view":
                if (selectedCount !== 1) {
                    APPUTIL.es_o.publish_px("app.cmd", ["alert", "Es kann nur genau ein Mitarbeiter angesehen werden!"]);
                } else {
                    //Request Single View
                }
                break;
            case "edit":
                if (selectedCount !== 1) {
                    APPUTIL.es_o.publish_px("app.cmd", ["alert", "Es kann nur genau ein Mitarbeiter bearbeitet werden!"]);
                } else {
                    //Request Single View
                }
                break;
            case "delete":
                if (selectedCount === 0) {
                    APPUTIL.es_o.publish_px("app.cmd", ["alert", "Bitte wählen Sie Mitarbeiter aus die Sie löschen wollen!"]);
                } else {
                    let doit = true;
                    if (selectedCount === 1) {
                        if(!confirm("Wollen Sie den markierten Mitarbeiter wirklich löschen?")) {
                            doit = false;
                        }
                    } else {
                        if(!confirm("Wollen Sie die markierten Mitarbeiter wirklich löschen?")) {
                            doit = false;
                        }
                    }
                    if (doit) {
                        //Request Delete of given Employees
                        let ids = []; //Int array
                        let index;
                        for (index = 0; index < selectedCount; index++) {
                            ids.push(parseInt(selected[index].dataset.userid, 10))
                        }
                        console.log(ids);
                    }
                }
                break;
            default:
                break;
        }
    }
}