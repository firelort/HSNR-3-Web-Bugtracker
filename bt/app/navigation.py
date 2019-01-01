# coding: utf-8
import cherrypy
from .database import Database_cl


class Navigation_cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)

    @cherrypy.tools.json_out()
    def GET(self, roleId):
        raise cherrypy.HTTPError(404, "Es ist ein interner Fehler aufgetreten!")
# EOF
