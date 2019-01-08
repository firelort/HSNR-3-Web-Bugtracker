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
    @cherrypy.tools.json_out()
    def GET(self, id=None):
        # If no id is provided show all projects
        if id is None:
            return self.db.getAllProjects()
        # If an id is given show the project or return a 404 Code if their is no project with the given id
        data = self.db.getProjectById(id)
        if not data is None:
            # Return data of the projct as json
            return data
        # Return an error code as json
        raise cherrypy.HTTPError(404, "Es existiert kein Projekt mit dieser ID")

    # Create a new project and return the id of this project as json
    @cherrypy.tools.json_out()
    def POST(self, name, desc):
        return {
            "id": self.db.createProject(name=name, desc=desc)
        }

    # Update a project with the given id, and return the success or an error
    @cherrypy.tools.json_out()
    def PUT(self, id, name, desc):
        if self.db.updateProject(id=id, name=name, desc=desc):
            return {
                "code": 200,
                "status": "OK",
                "message": "Projekt erfolgreich bearbeitet"
            }
        raise cherrypy.HTTPError(404, "Projekt wurde nicht gefunden")

    # Delete a project with the given id, and return the success or an error
    @cherrypy.tools.json_out()
    def DELETE(self, ids):
        if isinstance(ids, list):
            idList = [int(i) for i in ids]
        else:
            idList = [int(ids)]

        failed = []

        for id in idList:
            if not self.db.deleteProject(id):
                failed.append(id)

        if len(failed) > 0:
            msg = "Die Projekte mit der ID: "

            for entry in failed:
                msg += str(entry) + ", "

            # Remove the last blank and comma
            msg = msg[:-2]
            msg += " konnten nicht gelöscht werden."
            raise cherrypy.HTTPError(404, msg)
        else:
            return {
                "code": 200,
                "status": "OK",
                "message": "Alle Projekte erfolgreich gelöscht!"
            }

class ProjectComponent_Cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)

    # Get all components of a single project as json
    @cherrypy.tools.json_out()
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
        return data

class Component_Cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)

    # View all/one components
    @cherrypy.tools.json_out()
    def GET(self, id=None):
        # If no id is given show all components
        if id is None:
            return self.db.getAllComponents()

        # Check if the given id is valid
        data = self.db.getComponentById(id)

        if not data is None:
            # Return the data of the component as json
            return data
        # Return an error as json
        raise cherrypy.HTTPError(404, "Es existiert keine Komponente mit dieser ID")

    # Create a new component and return its id as json
    @cherrypy.tools.json_out()
    def POST(self, name, desc, project):
        id = self.db.createComponent(name, desc, project)
        if not id is None:
            return {
                "id": id
            }
        raise cherrypy.HTTPError(400, "Das angebene Projekt existiert nicht")

    # Update the component of the given id and return the success
    @cherrypy.tools.json_out()
    def PUT(self, id, name, desc, project):
        code = self.db.updateComponent(id, name, desc, project)
        if code == 0:
            return {
                "code": 200,
                "status": "OK",
                "message": "Komponente erfolgreich bearbeitet"
            }
        elif code == 1:
            raise cherrypy.HTTPError(404, "Komponente wurde nicht gefunden")
        else:
            raise cherrypy.HTTPError(404, "Das angebene Projekt existiert nicht")

    # Delete the component of the given and return the success
    @cherrypy.tools.json_out()
    def DELETE(self, ids):
        if isinstance(ids, list):
            idList = [int(i) for i in ids]
        else:
            idList = [int(ids)]

        failed = []

        for id in idList:
            if not self.db.deleteComponent(id):
                failed.append(id)

        if len(failed) > 0:
            msg = "Die Komponenten mit der ID: "

            for entry in failed:
                msg += str(entry) + ", "

            # Remove the last blank and comma
            msg = msg[:-2]
            msg += " konnten nicht gelöscht werden."
            raise cherrypy.HTTPError(404, msg)
        else:
            return {
                "code": 200,
                "status": "OK",
                "message": "Alle Komponenten erfolgreich gelöscht!"
            }
# EOF