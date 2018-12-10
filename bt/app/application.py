# coding: utf-8
import cherrypy

class Application_cl(object):
    exposed = True

    def GET(self):
        return "Hello World"

#EOF