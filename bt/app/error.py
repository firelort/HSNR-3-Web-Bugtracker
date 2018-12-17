# coding utf-8
import cherrypy
import json

from .database import Database_cl

"""

Anforderung              GET               PUT                POST             DELETE
--------------------------------------------------------------------------------------------------
fehler/                 Alle               -                  Ein neuen        -
                        Fehler                                Fehler       
                        liefern                               anlegen       
--------------------------------------------------------------------------------------------------
fehler/id               Ein                Ein                -                -
fehler/?id=id           Fehler             Fehler      
                        liefern            updaten     
--------------------------------------------------------------------------------------------------
fehler/type             Alle Fehler        -                  -                  -
fehler/?type=type       eines Types
                        liefern
--------------------------------------------------------------------------------------------------
katfehler/              Alle                -                 Ein neue          -
                        Fehlerkategorien                      Fehlerkategorie       
                        liefern                               anlegen       
--------------------------------------------------------------------------------------------------
katfehler/id            Ein                 Ein               -                 Ein
katfehler/?id=id        Fehlerkategorie     Fehlerkategorien                    Lösungskategorien
                        liefern             updaten                             loeschen
---------------------------------------------------------------------------------------------------
katursache/             Alle                -                 Ein neue           -
                        Lösungskategorien                     Lösungskategorien       
                        liefern                               anlegen       
---------------------------------------------------------------------------------------------------
katursache/id           Ein                 Ein               -                  Ein
katursache/?id=id       Lösungskategorien   Lösungskategorien                    Lösungskategorien
                        liefern             updaten                              loeschen
"""


class Error_Cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)

class ErrorCategories_Cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)

class ResultCategories_Cl(object):
    exposed = True

    def __init__(self, path):
        self.db = Database_cl(path)


#EOF