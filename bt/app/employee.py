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

    def GET(self, id=None):
        if id is None:
            return json.dumps(self.db.getAllSoftwareDeveloper(), indent=3)
        data = self.db.getSoftwareDeveloperById(id)
        if not data is None:
            return json.dumps(data, indent=3)
        return json.dumps({
            "code": 404,
            "status": "Error",
            "message": "Es existiert kein Software Entwickler mit dieser ID"
        }, indent=3)

    def POST(self, username, firstname, lastname, email, phone, address):
        return json.dumps({
            "id": self.db.createSoftwareDeveloper(username, firstname, lastname, email, phone, address)
        }, indent=3)

    def PUT(self, id, roleid, username, firstname, lastname, email, phone, address):
        if self.db.updateEmployee(id, roleid, username, firstname, lastname, email, phone, address):
            return json.dumps({
                "code": 200,
                "status": "OK",
                "message": "Software Entwickler erfolgreich bearbeitet"
            }, indent=3)
        return json.dumps({
            "code": 404,
            "status": "Fehler",
            "message": "Mitarbeiter wurde nicht gefunden"
        }, indent=3)

    def DELETE(self, id):
        if self.db.deleteEmployee(id):
            return json.dumps({
                "code": 200,
                "status": "OK",
                "message": "Software Entwickler erfolgreich gelöscht"
            }, indent=3)
        return json.dumps({
            "code": 404,
            "status": "Fehler",
            "message": "Software Entwickler wurde nicht gefunden"
        }, indent=3)


# ------------------------------------------------
class QualityManagement_Cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)

    def GET(self, id=None):
        if id is None:
            return json.dumps(self.db.getAllQualityManagement(), indent=3)

        data = self.db.getQualityManagementById(id)
        if not data is None:
            return json.dumps(data, indent=3)
        return json.dumps({
            "code": 404,
            "status": "Error",
            "message": "Es existiert kein Qualitatsmitarbeiter mit dieser ID"
        }, indent=3)

    def POST(self, username, firstname, lastname, email, phone, address):
        return json.dumps({
            "id": self.db.createQualityManagement(username, firstname, lastname, email, phone, address)
        })

    def PUT(self, id, roleid, username, firstname, lastname, email, phone, address):
        if self.db.updateEmployee(id, roleid, username, firstname, lastname, email, phone, address):
            return json.dumps({
                "code": 200,
                "status": "OK",
                "message": "Qualitatsmitarbeiter erfolgreich bearbeitet"
            }, indent=3)
        return json.dumps({
            "code": 404,
            "status": "Fehler",
            "message": "Mitarbeiter wurde nicht gefunden"
        }, indent=3)

    def DELETE(self, id):
        if self.db.deleteEmployee(id):
            return json.dumps({
                "code": 200,
                "status": "OK",
                "message": "Qualitatsmitarbeiter erfolgreich gelöscht"
            }, indent=3)
        return json.dumps({
            "code": 404,
            "status": "Fehler",
            "message": "Qualitatsmitarbeiter wurde nicht gefunden"
        }, indent=3)
