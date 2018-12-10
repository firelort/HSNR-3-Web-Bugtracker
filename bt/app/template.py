# coding: utf-8
import cherrypy
import codecs
import os
import json

"""
Anforderung       GET          PUT          POST          DELETE
----------------------------------------------------------------
/                 Alle         -            -             -
                  Templates
                  liefern
"""

class Template_cl(object):
    exposed = True

    def GET(self):
        retVal_o = {
            'templates': {}
        }

        files_a = os.listdir(os.path.join(cherrypy.Application.currentDir_s, 'templates'))
        dic_s = os.path.join(cherrypy.Application.currentDir_s, 'templates')
        for fileName_s in files_a:
            file_o  = codecs.open(os.path.join(dic_s, fileName_s), 'rU','utf-8')
            content_s = file_o.read()
            file_o.close()
            retVal_o["templates"][fileName_s] = content_s

        return json.dumps(retVal_o)
#EOF