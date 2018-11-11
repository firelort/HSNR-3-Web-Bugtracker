# coding: utf-8
import os
import cherrypy
from app import application

if __name__ == '__main__':
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
    except:
        current_dir = os.path.dirname(os.path.abspath(sys.executable))

    root_o = cherrypy.tree.mount(application.ApplicationCl(current_dir), '/')
    cherrypy.config.update({'request.show_traceback': False,
                            'server.socket_port': 80})
    cherrypy.server.socket_host = '0.0.0.0'
    cherrypy.engine.start()
    cherrypy.engine.block()
#EOF