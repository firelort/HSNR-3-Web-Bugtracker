# coding utf-8
import cherrypy
import json

from .database import Database_cl

"""

Anforderung              GET               PUT                POST             DELETE
--------------------------------------------------------------------------------------------------
fehler/                 Alle               -                  Ein neuen        -
                        Fehler                                Fehler       
                        liefern                               anlegen       
--------------------------------------------------------------------------------------------------
fehler/id               Ein                Ein                -                -
fehler/?id=id           Fehler             Fehler      
                        liefern            updaten     
--------------------------------------------------------------------------------------------------
fehler/type             Alle Fehler        -                  -                  -
fehler/?type=type       eines Types
                        liefern
--------------------------------------------------------------------------------------------------
katfehler/              Alle                -                 Ein neue          -
                        Fehlerkategorien                      Fehlerkategorie       
                        liefern                               anlegen       
--------------------------------------------------------------------------------------------------
katfehler/id            Ein                 Ein               -                 Ein
katfehler/?id=id        Fehlerkategorie     Fehlerkategorien                    Lösungskategorien
                        liefern             updaten                             loeschen
---------------------------------------------------------------------------------------------------
katursache/             Alle                -                 Ein neue           -
                        Lösungskategorien                     Lösungskategorien       
                        liefern                               anlegen       
---------------------------------------------------------------------------------------------------
katursache/id           Ein                 Ein               -                  Ein
katursache/?id=id       Lösungskategorien   Lösungskategorien                    Lösungskategorien
                        liefern             updaten                              loeschen
"""


class Error_Cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)

    @cherrypy.tools.json_out()
    def GET(self, id=None, type=None):
        if id is None:
            # Check if all or only of one type
            if type is None:
                # Return all Errors
                return self.db.getAllErrors()
            # Check if the type was valid
            data = self.db.getAllErrorsByType(type)
            if data is None:
                # Type wasn't valid
                raise cherrypy.HTTPError(404, "Es existiert kein derartiger Type")
            # Type is valid
            return data
        # Test if the given id was valid
        data = self.db.getErrorById(id)
        if data is None:
            # The given ID wasn't valid
            raise cherrypy.HTTPError(404, "Es existiert kein Fehler mit dieser ID")
            # The given ID was valid
        return data

    @cherrypy.tools.json_out()
    def POST(self, desc, employee, component, category):
        id = self.db.createNewError(desc, employee, component, category)
        # Test if it was successful
        if id == -1:
            # The error wasn't created, because at least one category doesn't exists
            raise cherrypy.HTTPError(400, "Es existieren nicht alle angebenen Katgorien")
        elif id == -2:
            # The error wasn't created, because at least one component doesn't exists
            raise cherrypy.HTTPError(400, "Es existieren nicht alle angebenen Komponenten")
        elif id == -3:
            # The error wasn't created, because the employee isn't allowed
            raise cherrypy.HTTPError(400, "Es existiert ein Problem mit dem QS-Mitarbeiter")
        # The error was successful created
        return {
            "id": id
        }

    @cherrypy.tools.json_out()
    def PUT(self, id, desc, employee, component, category):
        result = self.db.updateError(id, desc, employee, component, category)
        # Test if it was successful
        if result == -1:
            # The error wasn't updated, because at least one category doesn't exists
            raise cherrypy.HTTPError(400, "Es existieren nicht alle angebenen Katgorien")
        elif result == -2:
            # The error wasn't updated, because at least one component doesn't exists
            raise cherrypy.HTTPError(400, "Es existieren nicht alle angebenen Komponenten")
        elif result == -3:
            # The error wasn't updated, because the employee isn't allowed
            raise cherrypy.HTTPError(400, "Es existiert ein Problem mit dem QS-Mitarbeiter")
        elif result == -4:
            # The error wasn't updated, because the given id wasn't found.
            raise cherrypy.HTTPError(400, "Es existiert ein Problem mit dem QS-Mitarbeiter")
        # The error was successful updated
        return {
            "code": 200,
            "status": "OK",
            "message": "Der Fehler wurde erfolgreich bearbeitet"
        }


class ErrorCategories_Cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)


class ResultCategories_Cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)

# EOF
