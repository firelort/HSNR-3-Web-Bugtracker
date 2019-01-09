class evalProError_cl {
    render_px() {
        let requester_o = new APPUTIL.Requester_cl();

        // Request the result categories
        let path_s = "/projekt/";
        let projectPromise = new Promise(function (resolve, reject) {
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

        path_s = "/komponente/";
        let componentPromise = new Promise(function (resolve, reject) {
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

        Promise.all([projectPromise, errorPromise, componentPromise, employeePromise]).then(value => {
            //value[0] -> Projekt
            //value[1] -> Fehler
            //value[2] -> Komponente
            //value[3] -> Mitarbeiter
            let index;

            let employeeArray = [];
            // Map the employee id to the employee name
            for (index = 0; index < value[3].length; index++) {
                employeeArray[value[3][index].id] = value[3][index].firstname + " " + value[3][index].lastname;
            }

            // Replace the information for employee
            for (index = 0; index < value[1].length; index++) {
                value[1][index].employee = employeeArray[value[1][index].employee];
            }

            let data_o = value;
            data_o.pop();
            console.log(data_o);
            APPUTIL.view_o.render_px("eval-pro-error", data_o);
        });
    }
}