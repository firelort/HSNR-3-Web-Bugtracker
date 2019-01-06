class List_cl {
    constructor(element) {
        this.element_s = element;
    }

    render_px(template_s, data_o) {
        let path_s = template_s + "-list.tpl.html";
        let el_o = document.querySelector(this.element_s);
        if (el_o != null) {
            el_o.innerHTML = APPUTIL.tm_o.execute_px(path_s, data_o);
            this.configHandleEvent();
        }

    }

    configHandleEvent() {
        // add &#8597; to the heading and add eventlistner for sorting
        let headElements = document.querySelectorAll('thead.table-head tr th');
        for (let index = 0; index < headElements.length; index++) {
            if (headElements[index].classList.contains('clickable')) {
                let element = headElements[index];
                element.dataset.target = index;
                element.insertAdjacentHTML('beforeend', " &#8597;");
                element.addEventListener('click', this.handleEventSort);
            }
        }

        let bodyRows = document.querySelectorAll('table#list tbody.table-body tr');

        for (let index = 0; index < bodyRows.length; index++) {
            bodyRows[index].addEventListener('click', this.handleEventClick);
        }

    }

    handleEventSort(event) {
        event.stopPropagation();
        event.preventDefault();

        let choice = event.srcElement.dataset.target;
        var tbody, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        tbody = document.querySelector("tbody.table-body");
        switching = true;
        // Set the sorting direction to ascending:
        dir = "asc";
        // Make a loop that will continue until no switching has been done
        while (switching) {
            // Start by saying: no switching is done:
            switching = false;
            rows = tbody.rows;
            // Loop through all table rows
            for (i = 0; i < (rows.length - 1); i++) {
                // Start by saying there should be no switching:
                shouldSwitch = false;
                // two elements compare, current and next row
                x = rows[i].getElementsByTagName("td")[choice];
                y = rows[i + 1].getElementsByTagName("td")[choice];
                // Check if the two rows should switch place, based on the direction, asc or desc: */
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
                // If a switch has been marked, make the switch and mark that a switch has been done
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                // Each time a switch is done, increase this count by 1:
                switchcount++;
            } else {
                // If no switching has been done AND the direction is "asc", set the direction to "desc" and run the while loop again.
                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    }


    handleEventClick(event) {
        event.stopPropagation();
        event.preventDefault();

        function setButtonDisable(element, state_b) {
            switch (state_b) {
                case true:
                    element.classList.add('disabled');
                    element.setAttribute('disabled', '');
                    break;
                case false:
                    element.classList.remove('disabled');
                    element.removeAttribute('disabled');
                    break;
            }
        }

        function handleButtonStatus(count) {
            let buttons = document.querySelectorAll('main div.content-footer button');
            let button, index;
            switch (count) {
                case 0:
                    // Disable all buttons, but add
                    for (index = 0; index < buttons.length; index++) {
                        let button = buttons[index];
                        if (button.dataset.action === "add") {
                            setButtonDisable(button, false)
                        } else {
                            setButtonDisable(button, true)
                        }
                    }
                    break;
                case 1:
                    // Activate all buttons
                    for (index = 0; index < buttons.length; index++) {
                        let button = buttons[index];
                        setButtonDisable(button, false)
                    }
                    break;
                default:
                    // Disable all buttons, but add and delete
                    for (index = 0; index < buttons.length; index++) {
                        let button = buttons[index];
                        if (button.dataset.action === "add" || button.dataset.action === "delete") {
                            setButtonDisable(button, false)
                        } else {
                            setButtonDisable(button, true)
                        }
                    }
                    break;
            }
        }

        let element = event.target.parentNode;
        if (element.classList.contains("active")) {
            element.classList.remove("active");
        } else {
            element.classList.add("active");
        }

        //Check how much rows are active
        let activeRows = document.querySelectorAll("table#list tbody tr.active").length;
        handleButtonStatus(activeRows)
    }
}