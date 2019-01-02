# coding: utf-8
import cherrypy

from .database import Database_cl

class Role_cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)

    @cherrypy.tools.json_out()
    def GET(self):
        return self.db.getAllRoles()
#EOF