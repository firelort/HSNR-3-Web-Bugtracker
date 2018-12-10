#coding utf-8
import cherrypy

from .database import Database_cl


"""

Anforderung       GET          PUT          POST          DELETE
----------------------------------------------------------------
/                 Alle/Ein      -            -             -
                  Projecte
                  liefern

"""

class Project_cl(object):
    def __init__(self, path):
        self.db = Database_cl(path)

    def GET(self, projectID = None):
        if projectID is None:
            return "All Projects"
        else:
            return "Single Project"

#EOF