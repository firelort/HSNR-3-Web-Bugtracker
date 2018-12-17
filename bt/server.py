# coding: utf-8
import os
import cherrypy
from app import application, template, project, employee, error

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

    # 3. Eintrag: Method-Dispatcher für die "Applikation" "templates" vereinbaren
    cherrypy.tree.mount(
        template.Template_cl(),
        '/templates',
        {'/':
             {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
         }
    )

    # 4. Eintrag: Method-Dispatcher für die "Applikation" "projekt" vereinbaren
    cherrypy.tree.mount(
        project.Project_cl(currentDir_s),
        '/projekt',
        {'/':
             {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
         }
    )

    # 5. Eintrag: Method-Dispatcher für die "Applikation" "projektkomponenten" vereinbaren
    cherrypy.tree.mount(
        project.ProjectComponent_Cl(currentDir_s),
        '/projektkomponenten',
        {'/':
             {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
         }
    )

    # 6. Eintrag: Method-Dispatcher für die "Applikation" "komponente" vereinbaren
    cherrypy.tree.mount(
        project.Component_Cl(currentDir_s),
        '/komponente',
        {'/':
             {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
         }
    )

    # 7. Eintrag: Method-Dispatcher für die "Applikation" "swentwickler" vereinbaren
    cherrypy.tree.mount(
        employee.SoftwareDeveloper_Cl(currentDir_s),
        '/swentwickler',
        {'/':
             {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
         }
    )

    # 8. Eintrag: Method-Dispatcher für die "Applikation" "qsmitarbeiter" vereinbaren
    cherrypy.tree.mount(
        employee.QualityManagement_Cl(currentDir_s),
        '/qsmitarbeiter',
        {'/':
             {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
         }
    )

    # 9. Eintrag: Method-Dispatcher für die "Applikation" "qsmitarbeiter" vereinbaren
    cherrypy.tree.mount(
        error.errorCategories_Cl(currentDir_s),
        '/katfehler',
        {'/':
             {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
         }
    )

    cherrypy.config.update(configFileName_s)
    cherrypy.engine.start()
    cherrypy.engine.block()
#EOF