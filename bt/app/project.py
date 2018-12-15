# coding utf-8
import cherrypy
import json

from .database import Database_cl

"""

Anforderung       GET          PUT          POST          DELETE
----------------------------------------------------------------
/                 Alle         -           Ein neues       -
                  Projecte                 Project       
                  liefern                  anlegen       
                  
----------------------------------------------------------------
/id               Ein         Ein            -           Ein
/?id=id           Project     Project                    Project
                  liefern     updaten                    loeschen
"""


class Project_cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)

    # View all projects or a single
    def GET(self, id=None):
        # If no id is provided show all projects
        if id is None:
            return json.dumps(self.db.getAllProjects(), indent=3)
        # If an id is given show the project or return a 404 Code if their is no project with the given id
        data = self.db.getProjectById(id)
        if not data is None:
            # todo return http code as json
            return json.dumps(data, indent=3)
        return json.dumps({
            "code": 404,
            "status": "Error",
            "message": "Es existiert kein Projekt mit dieser ID"
        }, indent=3)

    # Create a new project and return the id of this project
    def POST(self, name, desc):
        return json.dumps({
            "id": self.db.createProject(name=name, desc=desc)
        })

    # Update a project with the given id, and return the success
    def PUT(self, id, name, desc):
        if self.db.updateProject(id=id, name=name, desc=desc):
            return json.dumps({
                "code": 200,
                "status": "OK",
                "message": "Projekt erfolgreich bearbeitet"
            }, indent=3)
        return json.dumps({
            "code": 404,
            "status": "Error",
            "message": "Projekt wurde nicht gefunden"
        }, indent=3)

    # Delete a project with the given id, and return the success
    def DELETE(self, id):
        if self.db.deleteProject(id=id):
            return json.dumps({
                "code": 200,
                "status": "OK",
                "message": "Projekt erfolgreich gelöscht"
            }, indent=3)
        return json.dumps({
            "code": 404,
            "status": "Error",
            "message": "Projekt wurde nicht gefunden"
        }, indent=3)
# EOF
