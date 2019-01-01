# coding: utf-8
import cherrypy
from .database import Database_cl


class Login_cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)

    @cherrypy.tools.json_out()
    def GET(self, username):
        userRoleId = self.db.getRoleIdByUsername(username)
        if not userRoleId is None:
            return {
                "roleId": userRoleId,
                "username": username
            }
        raise cherrypy.HTTPError(404, "Falsche Login Informationen, bitte erneut versuchen.")
# EOF
