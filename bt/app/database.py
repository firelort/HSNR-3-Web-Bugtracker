import os
import json

class Database_cl(object):
    def __init__(self, path):
        self.path_s  = os.path.join(path, "data")
        self.initJSON()

#-------------- JSON FILE
    def initJSON(self):
        file_s = os.path.join(self.path_s, 'employee.json')
        data = {}
        if not os.path.isfile(file_s):
            data = {
                'data': [],
                'roles': [{
                    'id': 1,
                    'name': "qs",
                    'desc': "QS-Mitarbeiter"
                },
                {
                    'id': 2,
                    'name': "se",
                    'desc': "SE-Mitarbeiter"
                }],
                'maxID': 0
            }
            self.writeJSONFile('employee', data)

        file_s = os.path.join(self.path_s, 'project.json')
        data = {}
        if not os.path.isfile(file_s):
            data = {
                'data': [],
                'maxID': 0
            }
            self.writeJSONFile('project', data)

        file_s = os.path.join(self.path_s, 'error.json')
        data = {}
        if not os.path.isfile(file_s):
            data = {
                'data': [],
                'errorCat': [],
                'resultCat': [],
                'maxID': 0
            }
            self.writeJSONFile('error', data)


    def writeJSONFile(self, filename, data):
        with open(os.path.join(self.path_s, filename + ".json"), "w") as f:
            f.write(json.dumps(data))

    def readJSONFile(self, filename):
        with open(os.path.join(self.path_s, filename + '.json'), "r") as f:
            data = json.load(f)
        return data
#--------------- HELP FUNCTIONS

    def isNumber(self, string):
        try:
            int(string)
            return True
        except:
            return False

    def getNextID(self, filename):
        return self.readJSONFIle(filename)['maxID'] + 1
#EOF