# coding: utf-8
import cherrypy

class Application_cl(object):
    exposed = True

    @cherrypy.tools.json_out()
    def GET(self):
        raise cherrypy.HTTPError(404, "Es existiert kein Qualitatsmitarbeiter mit dieser ID")
#EOF