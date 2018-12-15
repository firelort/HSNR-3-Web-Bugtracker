import os
import json

from .database import Database_cl

"""

Anforderung       GET          PUT          POST          DELETE
----------------------------------------------------------------
swentickler/      Alle         -           Ein neuen       -
                  SW-Ent                   SW-Ent       
                  liefern                  anlegen       

----------------------------------------------------------------
swentickler/id    Ein         Ein            -           Ein
swentickler/?id   SW-Ent      SW-Ent                     SW-Ent 
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
    def GET(self, id=None):
        # if no id is given show all
        if id is None:
            return json.dumps(self.db.getAllSoftwareDeveloper(), indent=3)

        # Check if the given id is valid
        data = self.db.getSoftwareDeveloperById(id)
        if not data is None:
            # Return data of the software developer as json
            return json.dumps(data, indent=3)
        # return an error code as json
        return json.dumps({
            "code": 404,
            "status": "Error",
            "message": "Es existiert kein Software Entwickler mit dieser ID"
        }, indent=3)

    # Create a new software developer and return the id as json
    def POST(self, username, firstname, lastname, email, phone, address):
        return json.dumps({
            "id": self.db.createSoftwareDeveloper(username, firstname, lastname, email, phone, address)
        }, indent=3)

    # Update the employee with the given id and return the success or an error
    def PUT(self, id, roleid, username, firstname, lastname, email, phone, address):
        if self.db.updateEmployee(id, roleid, username, firstname, lastname, email, phone, address):
            return json.dumps({
                "code": 200,
                "status": "OK",
                "message": "Software Entwickler erfolgreich bearbeitet"
            }, indent=3)
        return json.dumps({
            "code": 404,
            "status": "Error",
            "message": "Mitarbeiter wurde nicht gefunden"
        }, indent=3)

    # Delete the employee with the given id and return the success or an error
    def DELETE(self, id):
        if self.db.deleteEmployee(id):
            return json.dumps({
                "code": 200,
                "status": "OK",
                "message": "Software Entwickler erfolgreich gelöscht"
            }, indent=3)
        return json.dumps({
            "code": 404,
            "status": "Error",
            "message": "Software Entwickler wurde nicht gefunden"
        }, indent=3)


# ------------------------------------------------
class QualityManagement_Cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)

    # View all/one QualityManagement
    def GET(self, id=None):
        # if no id is given show all
        if id is None:
            return json.dumps(self.db.getAllQualityManagement(), indent=3)

        # Check if the given id is valid
        data = self.db.getQualityManagementById(id)
        if not data is None:
            # Return data of the quality employee as json
            return json.dumps(data, indent=3)
        # Return an error code as json
        return json.dumps({
            "code": 404,
            "status": "Error",
            "message": "Es existiert kein Qualitatsmitarbeiter mit dieser ID"
        }, indent=3)

    # Create a new quality employee and return the id as json
    def POST(self, username, firstname, lastname, email, phone, address):
        return json.dumps({
            "id": self.db.createQualityManagement(username, firstname, lastname, email, phone, address)
        })

    # Update the employee with the given id and return the success or an error
    def PUT(self, id, roleid, username, firstname, lastname, email, phone, address):
        if self.db.updateEmployee(id, roleid, username, firstname, lastname, email, phone, address):
            return json.dumps({
                "code": 200,
                "status": "OK",
                "message": "Qualitatsmitarbeiter erfolgreich bearbeitet"
            }, indent=3)
        return json.dumps({
            "code": 404,
            "status": "Error",
            "message": "Mitarbeiter wurde nicht gefunden"
        }, indent=3)

    # Delete the employee with the given id and return the success or an error
    def DELETE(self, id):
        if self.db.deleteEmployee(id):
            return json.dumps({
                "code": 200,
                "status": "OK",
                "message": "Qualitatsmitarbeiter erfolgreich gelöscht"
            }, indent=3)
        return json.dumps({
            "code": 404,
            "status": "Error",
            "message": "Qualitatsmitarbeiter wurde nicht gefunden"
        }, indent=3)
