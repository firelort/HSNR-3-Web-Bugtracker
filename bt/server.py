# coding: utf-8
import os
import cherrypy
from app import application, template, project

if __name__ == '__main__':
    try:
        currentDir_s = os.path.dirname(os.path.abspath(__file__))
    except:
        currentDir_s = os.path.dirname(os.path.abspath(sys.executable))
    cherrypy.Application.currentDir_s = currentDir_s

    # im aktuellen Verzeichnis
    configFileName_s = os.path.join(currentDir_s, 'server.conf')
    if not os.path.exists(configFileName_s):
        # Datei gibt es nicht
        configFileName_s = None

    # autoreload-Monitor hier abschalten
    #cherrypy.engine.autoreload.unsubscribe()

    # 1. Eintrag: Standardverhalten, Berücksichtigung der Konfigurationsangaben im configFile
    cherrypy.tree.mount(
        None, '/', configFileName_s
    )

    # 2. Eintrag: Method-Dispatcher für die "Applikation" "app" vereinbaren
    cherrypy.tree.mount(
        application.Application_cl(),
        '/app',
        {'/':
             {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
         }
    )

    # 2. Eintrag: Method-Dispatcher für die "Applikation" "templates" vereinbaren
    cherrypy.tree.mount(
        template.Template_cl(),
        '/templates',
        {'/':
             {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
         }
    )

    cherrypy.tree.mount(
        project.Project_cl(currentDir_s),
        '/projekt',
        {'/':
             {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
         }
    )

    cherrypy.config.update(configFileName_s)
    cherrypy.engine.start()
    cherrypy.engine.block()
#EOF