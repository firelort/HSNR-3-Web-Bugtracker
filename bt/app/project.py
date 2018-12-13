#coding utf-8
import cherrypy
import json

from .database import Database_cl


"""

Anforderung       GET          PUT          POST          DELETE
----------------------------------------------------------------
/                 Alle/Ein      -           Ein neues       -
                  Projecte                  Project
                  liefern                   anlegen

"""

class Project_cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)

    # View all projects or a single
    def GET(self, id=None):
        #If no id is provided show all projects
        if id is None:
            return json.dumps(self.db.getAllProjects(), indent=3)
        #If an id is given show the project or return a 404 Code if their is no project with the given id
        data = self.db.getProjectById(id)
        if data is None:
            #todo return http code as json
            raise cherrypy.HTTPError(404, "Thier is no project with the given information")
        return json.dumps(data, indent=3)

    #Create a new project and return the id of this project
    def POST(self, name, desc):
        data = self.db.createProject(name=name, desc=desc)
        return str(data) # TODO return the data as json

    def PUT(self, id, name, desc):
        if self.db.updateProject(id=id, name=name, desc=desc):
            return "True" # todo return json delete successful
        return "False"  # todo return json their is no project with the given id

    def DELETE(self, id):
        if self.db.deleteProject(id=id):
            return "True"  # todo return json delete successful
        return "False"  # todo return json their is no project with the given id
#EOF