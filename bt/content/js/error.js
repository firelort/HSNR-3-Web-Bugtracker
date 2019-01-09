class Errors_cl {
    render_px() {
        // Request the categories
        let requester_o = new APPUTIL.Requester_cl();
        let path_s = "/katfehler/";
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

        // Request the error list
        path_s = "/fehler/";
        let errorPromise = new Promise(function (resolve, reject) {
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

        // Request components
        path_s = "/komponente/";
        let componentsPromise = new Promise(function (resolve, reject) {
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
        path_s = "/qsmitarbeiter/";
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


        //Wait for all data, and merge them
        Promise.all([categoriePromise, errorPromise, componentsPromise, employeePromise]).then(value => {
            //value[0] -> Category
            //value[1] -> Errors
            //value[2] -> Components
            //value[3] -> QS-Employee

            // Arrays for replacing int with the corresponding information
            let categorytArray = [];
            let componentArray = [];
            let employeeArray = [];
            let index;

            // Map the category id to the category name
            for (index = 0; index < value[0].length; index++) {
                categorytArray[value[0][index].id] = value[0][index].name;
            }

            // Map the component id to the component name
            for (index = 0; index < value[2].length; index++) {
                componentArray[value[2][index].id] = value[2][index].name;
            }

            // Map the employee id to the employee name
            for (index = 0; index < value[3].length; index++) {
                employeeArray[value[3][index].id] = value[3][index].firstname + " " + value[3][index].lastname;
            }

            for (index = 0; index < value[1].length; index++) {
                let categories = value[1][index].categories;
                // Replace the information for categories
                for (let secIndex = 0; secIndex < categories.length; secIndex++) {
                    value[1][index].categories[secIndex] = categorytArray[value[1][index].categories[secIndex]];
                }

                // Replace the information for components
                value[1][index].component = componentArray[value[1][index].component];

                // Replace the information for employee
                value[1][index].employee = employeeArray[value[1][index].employee];
            }

            // Render the template with the error array value[1]
            this.doRender(value[1]);
        });
    }

    doRender(data_o) {
        APPUTIL.list_o.render_px("fehler", data_o);
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
                APPUTIL.es_o.publish_px("app.cmd", ["add-item", "fehler"]);
                break;
            case "view":
                if (selectedCount !== 1) {
                    APPUTIL.es_o.publish_px("alert", ["Es kann nur genau ein Fehler angesehen werden!"]);
                } else {
                    APPUTIL.es_o.publish_px("app.cmd", ["single-view", "fehler", selected[0].dataset.id]);
                }
                break;
            case "edit":
                if (selectedCount !== 1) {
                    APPUTIL.es_o.publish_px("alert", ["Es kann nur genau ein Fehler bearbeitet werden!"]);
                } else {
                    APPUTIL.es_o.publish_px("app.cmd", ["edit-view", "fehler", selected[0].dataset.id]);
                }
                break;
        }
    }
}

class ErrorView_cl {
    render_px(id) {
        // Request the categories
        let requester_o = new APPUTIL.Requester_cl();
        let path_s = "/katfehler/";
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

        // Request the error list
        path_s = "/fehler/?id=" + id;
        let errorPromise = new Promise(function (resolve, reject) {
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

        // Request components
        path_s = "/komponente/";
        let componentsPromise = new Promise(function (resolve, reject) {
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
        path_s = "/qsmitarbeiter/";
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

        //Wait for all data, and merge them
        Promise.all([categoriePromise, errorPromise, componentsPromise, employeePromise]).then(value => {
            //value[0] -> Category
            //value[1] -> Error
            //value[2] -> Components
            //value[3] -> QS-Employee

            // Arrays for replacing int with the corresponding information
            let categorytArray = [];
            let componentArray = [];
            let employeeArray = [];
            let index;

            // Request the result
            let resultPromise = new Promise(function (resolve, reject) {
                if (value[1].result === -1) {
                    resolve([{"type": true}])
                } else {
                    path_s = "/loesung/?id=" + value[1].result;
                    requester_o.get_px(path_s,
                        function (responseText_spl) {
                            let dataL_o = JSON.parse(responseText_spl);
                            resolve(dataL_o);
                        }, function (responseText_spl) {
                            let data_o = JSON.parse(responseText_spl);
                            APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                            reject(data_o['message']);
                        });
                }
            });

            // Request the result categories
            let resultCatPromise = new Promise(function (resolve, reject) {
                if (value[1].result === -1) {
                    resolve([])
                } else {
                    path_s = "/katursache/";
                    requester_o.get_px(path_s,
                        function (responseText_spl) {
                            let dataL_o = JSON.parse(responseText_spl);
                            resolve(dataL_o);
                        }, function (responseText_spl) {
                            let data_o = JSON.parse(responseText_spl);
                            APPUTIL.es_o.publish_px("alert", [data_o['message']]);
                            reject(data_o['message']);
                        });
                }
            });

            // Map the category id to the category name
            for (index = 0; index < value[0].length; index++) {
                categorytArray[value[0][index].id] = value[0][index].name;
            }

            // Map the component id to the component name
            for (index = 0; index < value[2].length; index++) {
                componentArray[value[2][index].id] = value[2][index].name;
            }

            // Map the employee id to the employee name
            for (index = 0; index < value[3].length; index++) {
                employeeArray[value[3][index].id] = value[3][index].firstname + " " + value[3][index].lastname;
            }


            // Replace the information for categories
            for (index = 0; index < value[1].categories.length; index++) {
                value[1].categories[index] = categorytArray[value[1].categories[index]];
            }

            // Replace the information for components
            value[1].component = componentArray[value[1].component];

            // Replace the information for employee
            value[1].employee = employeeArray[value[1].employee];

            let errorDataFinish = value[1];
            Promise.all([resultPromise, resultCatPromise]).then(array => {
                array[0].employee = employeeArray[array[0].employee];

                if (errorDataFinish.result !== -1) {
                    let resultCatArray = [];
                    for (index = 0; index < array[1].length; index++) {
                        resultCatArray[array[1][index].id] = array[1][index].name;
                    }

                    for (index = 0; index < array[0].categories.length; index++) {
                        array[0].categories[index] = resultCatArray[array[0].categories[index]];
                    }
                }


                // Render the template
                let data_o = [value[1]].concat(array[0]);
                APPUTIL.view_o.render_px("fehler", data_o);
                this.configEventHandler();
            });

        });
    }

    configEventHandler() {
        let resultButton = document.querySelector('main div.content-footer button#result');
        if (resultButton != null) {
            let resultButtonClone = resultButton.cloneNode(true);
            resultButton.parentNode.replaceChild(resultButtonClone, resultButton);
            resultButtonClone.addEventListener('click', this.handleEvent);
        }
        let secResultButton = document.querySelector('main div.content-footer button#result-sec');
        if (secResultButton != null) {
            let secResultButtonClone = secResultButton.cloneNode(true);
            secResultButton.parentNode.replaceChild(secResultButtonClone, secResultButton);
            secResultButtonClone.addEventListener('click', this.handleEventSecond);
        }
    }

    handleEvent(event) {
        event.stopPropagation();
        event.preventDefault();
        let errorid = document.querySelector("main div.content-footer").dataset.id;
        APPUTIL.es_o.publish_px("app.cmd", ["add-item", "result", errorid]);
    }

    handleEventSecond(event) {
        event.stopPropagation();
        event.preventDefault();
        let resultid = document.querySelector("main div.content-footer button#result-sec").dataset.id;
        APPUTIL.es_o.publish_px("app.cmd", ["edit-view", "result", resultid]);
    }

}

class ErrorEdit_cl {
    render_px(id) {
        let requester_o = new APPUTIL.Requester_cl();

        // Request the error
        let path_s = "/fehler/?id=" + id;
        let errorPromise = new Promise(function (resolve, reject) {
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

        path_s = "/katfehler/";
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

        // Request projects
        path_s = "/projekt/";
        let projektPromise = new Promise(function (resolve, reject) {
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
        path_s = "/qsmitarbeiter/";
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

        path_s = "/komponente/";
        let componentPromoise = new Promise(function (resolve, reject) {
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


        Promise.all([errorPromise, categoriePromise, employeePromise, projektPromise, componentPromoise]).then(value => {
            //value[0] -> Der Fehler mti der ID
            //value[1] -> Alle Fehler Kategorien
            //value[2] -> Alle Mitarbeiter QS
            //value[3] -> Alle Projekte
            //value[4] -> Alle Komponenten

            //Map the the id to an object of id and name
            let componentInfo = [];

            for (let index = 0; index < value[4].length; index++) {
                componentInfo[value[4][index].id] = {
                    "id": value[4][index].id,
                    "name": value[4][index].name
                }
            }

            //Replace the information in the compnent array in each project
            for (let index = 0; index < value[3].length; index++) {
                for (let compIndex = 0; compIndex < value[3][index].component.length; compIndex++) {
                    value[3][index].component[compIndex] = componentInfo[value[3][index].component[compIndex]];
                }
            }

            let data_o = value;
            data_o.pop();
            APPUTIL.edit_o.render_px("fehler", data_o);
        });
    }
}

class ErrorAdd_cl {
    constructor(element, template) {
        this.element_s = element;
        this.template_s = template;
    }

    render_px() {
        let requester_o = new APPUTIL.Requester_cl();

        // Request the error categories
        let path_s = "/katfehler/";
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

        // Request projects
        path_s = "/projekt/";
        let projektPromise = new Promise(function (resolve, reject) {
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
        path_s = "/qsmitarbeiter/";
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

        path_s = "/komponente/";
        let componentPromoise = new Promise(function (resolve, reject) {
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


        Promise.all([categoriePromise, employeePromise, projektPromise, componentPromoise]).then(value => {
            //value[0] -> Alle Fehler Kategorien
            //value[1] -> Alle Mitarbeiter QS
            //value[2] -> Alle Projekte
            //value[3] -> Alle Komponenten
            //Map the the id to an object of id and name
            let componentInfo = [];

            for (let index = 0; index < value[3].length; index++) {
                componentInfo[value[3][index].id] = {
                    "id": value[3][index].id,
                    "name": value[3][index].name
                }
            }

            //Replace the information in the compnent array in each project
            for (let index = 0; index < value[2].length; index++) {
                for (let compIndex = 0; compIndex < value[2][index].component.length; compIndex++) {
                    value[2][index].component[compIndex] = componentInfo[value[2][index].component[compIndex]];
                }
            }

            let data_o = [{"createnew": true, "categories": []}].concat(value);
            data_o.pop();
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
                let idElement = document.querySelector('main div.content-body form#fehler-form input[type=hidden]');
                if (idElement != null) {
                    idElement.parentNode.removeChild(idElement);
                }

                //Test if all inputs are filled
                let form = document.querySelector('main div.content-body form#fehler-form');
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

                requester_o.post_px("/fehler/", formData,
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