import os
import cherrypy

from .database import Database_cl

"""

Anforderung       GET          PUT          POST          DELETE
----------------------------------------------------------------
swentwickler/     Alle         -           Ein neuen       -
                  SW-Ent                   SW-Ent       
                  liefern                  anlegen       

----------------------------------------------------------------
swentwickler/id   Ein         Ein            -           Ein
swentwickler/?id  SW-Ent      SW-Ent                     SW-Ent 
                  liefern     updaten                    loeschen
                  
----------------------------------------------------------------
qsmitarbeiter/    Alle         -           Ein neuen       -
                  QS-Mit                   QS-Mit       
                  liefern                  anlegen       

----------------------------------------------------------------
qsmitarbeiter/id  Ein         Ein            -           Ein
qsmitarbeiter/?id QS-Mit      QS-Mit                     QS-Mit
                  liefern     updaten                    loeschen
"""


class SoftwareDeveloper_Cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)

    # View all/one SoftwareDevelopers
    @cherrypy.tools.json_out()
    def GET(self, id=None):
        # if no id is given show all
        if id is None:
            return self.db.getAllSoftwareDeveloper()

        # Check if the given id is valid
        data = self.db.getSoftwareDeveloperById(id)
        if not data is None:
            # Return data of the software developer as json
            return data
        # return an error code as json
        return {
            "code": 404,
            "status": "Error",
            "message": "Es existiert kein Software Entwickler mit dieser ID"
        }

    # Create a new software developer and return the id as json
    @cherrypy.tools.json_out()
    def POST(self, username, firstname, lastname, email, phone, address):
        return {
            "id": self.db.createSoftwareDeveloper(username, firstname, lastname, email, phone, address)
        }

    # Update the employee with the given id and return the success or an error
    @cherrypy.tools.json_out()
    def PUT(self, id, roleid, username, firstname, lastname, email, phone, address):
        if self.db.updateEmployee(id, roleid, username, firstname, lastname, email, phone, address):
            return {
                "code": 200,
                "status": "OK",
                "message": "Software Entwickler erfolgreich bearbeitet"
            }
        return {
            "code": 404,
            "status": "Error",
            "message": "Mitarbeiter wurde nicht gefunden"
        }

    # Delete the employee with the given id and return the success or an error
    @cherrypy.tools.json_out()
    def DELETE(self, id):
        if self.db.deleteEmployee(id):
            return {
                       "code": 200,
                       "status": "OK",
                       "message": "Software Entwickler erfolgreich gelöscht"
                   },
        return {
            "code": 404,
            "status": "Error",
            "message": "Software Entwickler wurde nicht gefunden"
        }


# ------------------------------------------------
class QualityManagement_Cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)

    # View all/one QualityManagement
    @cherrypy.tools.json_out()
    def GET(self, id=None):
        # if no id is given show all
        if id is None:
            return self.db.getAllQualityManagement()

        # Check if the given id is valid
        data = self.db.getQualityManagementById(id)
        if not data is None:
            # Return data of the quality employee as json
            return data
        # Return an error code as json
        return {
            "code": 404,
            "status": "Error",
            "message": "Es existiert kein Qualitatsmitarbeiter mit dieser ID"
        }

    # Create a new quality employee and return the id as json
    @cherrypy.tools.json_out()
    def POST(self, username, firstname, lastname, email, phone, address):
        return {
            "id": self.db.createQualityManagement(username, firstname, lastname, email, phone, address)
        }

    # Update the employee with the given id and return the success or an error
    @cherrypy.tools.json_out()
    def PUT(self, id, roleid, username, firstname, lastname, email, phone, address):
        if self.db.updateEmployee(id, roleid, username, firstname, lastname, email, phone, address):
            return {
                "code": 200,
                "status": "OK",
                "message": "Qualitatsmitarbeiter erfolgreich bearbeitet"
            }
        return {
            "code": 404,
            "status": "Error",
            "message": "Mitarbeiter wurde nicht gefunden"
        }

    # Delete the employee with the given id and return the success or an error
    @cherrypy.tools.json_out()
    def DELETE(self, id):
        if self.db.deleteEmployee(id):
            return {
                "code": 200,
                "status": "OK",
                "message": "Qualitatsmitarbeiter erfolgreich gelöscht"
            }
        return {
            "code": 404,
            "status": "Error",
            "message": "Qualitatsmitarbeiter wurde nicht gefunden"
        }
