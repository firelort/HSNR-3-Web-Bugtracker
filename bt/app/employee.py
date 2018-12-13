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
        self.db =  Database_cl(path)

    def GET(self, id=None):
        if id is None:
            return json.dumps(self.db.getAllSoftwareDeveloper(), indent=3)
        return json.dumps(self.db.getEmployeeById(id), indent=3)

    def POST(self, username, firstname, lastname, email, phone, address):
        data = self.db.createSoftwareDeveloper(username, firstname, lastname, email, phone, address)
        return str(data)  # TODO return the data as json

    def PUT(self, id, roleid, username, firstname, lastname, email, phone, address):
        return 1

#------------------------------------------------
class QualityManagement_Cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)

    def GET(self, id=None):
        if id is None:
            return json.dumps(self.db.getAllQualityManagement(), indent=3)
        return json.dumps(self.db.getAllQualityManagement(id), indent=3)

    def POST(self, username, firstname, lastname, email, phone, address):
        data = self.db.createQualityManagement(username, firstname, lastname, email, phone, address)
        return str(data)  # TODO return the data as json