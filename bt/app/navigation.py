# coding: utf-8
import cherrypy
from .database import Database_cl


class Navigation_cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)

    @cherrypy.tools.json_out()
    def GET(self, roleId):
        commonNav = [{
            "target": "home",
            "action": "home",
            "name": "Startseite"
        }, {
            "target": "fehler",
            "action": "list-view",
            "name": "Fehelerübersicht"
        }, {
            "target": "projekt",
            "action": "list-view",
            "name": "Pflege Projekte"
        }, {
            "target": "komponente",
            "action": "list-view",
            "name": "Pflege Komponenten"
        }, {
            "target": "employee",
            "action": "list-view",
            "name": "Pflege Daten Mitarbeiter"
        }, {
            "target": "category",
            "action": "list-view",
            "name": "Pflege Kategorien"
        }, {
            "target": "",
            "action": "eval-pro-err",
            "name": "Auswertung Projekte/Fehler"
        }, {
            "target": "",
            "action": "eval-cat-err",
            "name": "Auswertung Kategroien/Fehler"
        },
        ]
        if int(roleId) == 1:
            # The user is a QS-Mitarbeiter
            qsNav = [{
                "target": "fehler",
                "action": "add-item",
                "name": "Neuen Fehler anlegen"
            }]
            return qsNav + commonNav
        elif int(roleId) == 2:
            # The user is a SE-Mitarbeiter
            seNav = []
            return seNav + commonNav
        raise cherrypy.HTTPError(404, "Es ist ein interner Fehler aufgetreten!")
# EOF
