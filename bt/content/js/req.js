//------------------------------------------------------------------------------
// Einfache Anforderungen per Fetch-API
//------------------------------------------------------------------------------
// rev. 1, 21.11.2018, Bm
//------------------------------------------------------------------------------

'use strict'

if (APPUTIL === undefined) {
    var APPUTIL = {};
}

APPUTIL.Requester_cl = class {
    constructor() {
    }


    get_px(path_spl, success_ppl, fail_ppl) {
        let options = {
            chache: "no-cache"
        };

        fetch(path_spl, options)
            .then(function (response_opl) {
                let retVal_o = null;
                if (response_opl.ok) { // 200er-Status-Code
                    retVal_o = response_opl.text().then(function (text_spl) {
                        success_ppl(text_spl);
                    });
                } else {
                    retVal_o = response_opl.text().then(function (text_spl) {
                        fail_ppl(text_spl);
                    });
                }
                return retVal_o;
            })
            .catch(function (error_opl) {
                console.log('[Requester] fetch-Problem: ', error_opl.message);
            });
    }

    put_px(path_spl, data, success_ppl, fail_ppl) {
        let options = {
            method: "PUT",
            chache: "no-cache",
            body: data
        };
        fetch(path_spl, options)
            .then(function (response_opl) {
                let retVal_o = null;
                if (response_opl.ok) { // 200er-Status-Code
                    retVal_o = response_opl.text().then(function (text_spl) {
                        success_ppl(text_spl);
                    });
                } else {
                    retVal_o = response_opl.text().then(function (text_spl) {
                        fail_ppl(text_spl);
                    });
                }
                return retVal_o;
            })
            .catch(function (error_opl) {
                console.log('[Requester] fetch-Problem: ', error_opl.message);
            });
    }

    post_px(path_spl, data, success_ppl, fail_ppl) {
        let options = {
            method: "POST",
            chache: "no-cache",
            body: data
        };
        fetch(path_spl, options)
            .then(function (response_opl) {
                let retVal_o = null;
                if (response_opl.ok) { // 200er-Status-Code
                    retVal_o = response_opl.text().then(function (text_spl) {
                        success_ppl(text_spl);
                    });
                } else {
                    retVal_o = response_opl.text().then(function (text_spl) {
                        fail_ppl(text_spl);
                    });
                }
                return retVal_o;
            })
            .catch(function (error_opl) {
                console.log('[Requester] fetch-Problem: ', error_opl.message);
            });
    }

    delete_px(path_spl, ids, success_ppl, fail_ppl) {
        var string = "";
        let first = true;
        ids.forEach(function (element) {
            if (first) {
                string = string + "?ids=" + element;
                first = false;
            } else {
                string = string + "&ids=" + element;
            }
        });

        let options = {
            method: "DELETE",
            chache: "no-cache"
        };
        fetch(path_spl + string, options)
            .then(function (response_opl) {
                let retVal_o = null;
                if (response_opl.ok) { // 200er-Status-Code
                    retVal_o = response_opl.text().then(function (text_spl) {
                        success_ppl(text_spl);
                    });
                } else {
                    retVal_o = response_opl.text().then(function (text_spl) {
                        fail_ppl(text_spl);
                    });
                }
                return retVal_o;
            }).catch(function (error_opl) {
            console.log('[Requester] fetch-Problem: ', error_opl.message);
        });
    }
};
// EOF