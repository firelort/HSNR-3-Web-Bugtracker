# coding utf-8
import cherrypy
import json

from .database import Database_cl

"""

Anforderung              GET          PUT          POST          DELETE
-----------------------------------------------------------------------------
projekt/                  Alle         -           Ein neues       -
                          Projekte                 Projekt       
                          liefern                  anlegen       
-----------------------------------------------------------------------------
projekt/id                Ein         Ein           -            Ein
projekt/?id=id            Projekt     Projekt                    Projekt
                          liefern     updaten                    loeschen
------------------------------------------------------------------------------
projektkomponenten/id     Komponenten   -           -             -
projektkomponenten/?id=id gemäß Projekt    
                          ID liefern     
-----------------------------------------------------------------------------
komponente/               Alle         -           Ein neue       -
                          Komponenten              Komponenten       
                          liefern                  anlegen       
-----------------------------------------------------------------------------
komponente/id             Ein         Ein            -           Ein
komponente/?id=id         Komponente  Komponente                 Komponente
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
            # Return data of the projct as json
            return json.dumps(data, indent=3)
        # Return an error code as json
        return json.dumps({
            "code": 404,
            "status": "Error",
            "message": "Es existiert kein Projekt mit dieser ID"
        }, indent=3)

    # Create a new project and return the id of this project as json
    def POST(self, name, desc):
        return json.dumps({
            "id": self.db.createProject(name=name, desc=desc)
        })

    # Update a project with the given id, and return the success or an error
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

    # Delete a project with the given id, and return the success or an error
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


class ProjectComponent_Cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)

    # Get all components of a single project as json
    def GET(self, id):
        # Get all component ids of a single project as an array
        components = self.db.getProjectById(id)['component']
        data = []
        for entry in components:
            # Use the get methode of component by id to get the information per component and append this to data array
            component = self.db.getComponentById(entry)
            if not component is None:
                data.append(component)
        # Return the array / all components a project has
        return json.dumps(data, indent=3)


class Component_Cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)

    # View all/one components
    def GET(self, id=None):
        # If no id is given show all components
        if id is None:
            return json.dumps(self.db.getAllComponents(), indent=3)

        # Check if the given id is valid
        data = self.db.getComponentById(id)

        if not data is None:
            # Return the data of the component as json
            return json.dumps(data, indent=3)
        # Return an error as json
        return json.dumps({
            "code": 404,
            "status": "Error",
            "message": "Es existiert keine Komponente mit dieser ID"
        }, indent=3)

    # todo: projects should be an array

    # Create a new component and return its id as json
    def POST(self, name, desc, projects):
        id = self.db.createComponent(name, desc, projects)
        if not id is None:
            return json.dumps({
                "id": id
            }, indent=3)
        return json.dumps({
            "code": 400,
            "status": "Error",
            "message": "Es existieren angebene Projekte nicht"
        }, indent=3)


    # Update the component of the given id and return the success
    def PUT(self, id, name, desc, projects):
        code = self.db.updateComponent(id=id, name=name, desc=desc, projectids=projects)
        if code == 0:
            return json.dumps({
                "code": 200,
                "status": "OK",
                "message": "Komponente erfolgreich bearbeitet"
            }, indent=3)
        elif code == 1:
            return json.dumps({
                "code": 404,
                "status": "Error",
                "message": "Komponente wurde nicht gefunden"
            }, indent=3)
        else:
            return json.dumps({
                "code": 404,
                "status": "Error",
                "message": "Es existieret mindestens ein angebenes Projekt nicht"
            }, indent=3)



    # Delete the component of the given and return the success
    def DELETE(self, id):
        if self.db.deleteComponent(id=id):
            return json.dumps({
                "code": 200,
                "status": "OK",
                "message": "Komponente erflogreich gelöscht"
            }, indent=3)
        return json.dumps({
            "code": 404,
            "status": "Error",
            "message": "Komponente wurde nicht gefunden"
        }, indent=3)
# EOF
