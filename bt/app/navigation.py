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
            "name": "Startseite"
        }, {
            "target": "all-errors",
            "name": "Fehelerübersicht"
        }, {
            "target": "all-projects",
            "name": "Pflege Projekte"
        }, {
            "target": "all-components",
            "name": "Pflege Komponenten"
        }, {
            "target": "all-employees",
            "name": "Pflege Daten Mitarbeiter"
        }, {
            "target": "all-categories",
            "name": "Pflege Kategorien"
        }, {
            "target": "eval-pro-err",
            "name": "Auswertung Projekte/Fehler"
        }, {
            "target": "eval-cat-err",
            "name": "Auswertung Kategroien/Fehler"
        },
        ]
        if int(roleId) == 1:
            # The user is a QS-Mitarbeiter
            qsNav = [{
                "target": "new-error",
                "name": "Neuen Fehler anlegen"
            }]
            return qsNav + commonNav
        elif int(roleId) == 2:
            # The user is a SE-Mitarbeiter
            seNav = []
            return seNav + commonNav
        raise cherrypy.HTTPError(404, "Es ist ein interner Fehler aufgetreten!")
# EOF
