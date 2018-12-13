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
                'maxId': 0
            }
            self.writeJSONFile('employee', data)

        file_s = os.path.join(self.path_s, 'project.json')
        data = {}
        if not os.path.isfile(file_s):
            data = {
                "projects": [],
                "components": [],
                "maxCompId": 0,
                "maxId": 0
            }
            self.writeJSONFile('project', data)

        file_s = os.path.join(self.path_s, 'error.json')
        data = {}
        if not os.path.isfile(file_s):
            data = {
                'data': [],
                'errorCat': [],
                'resultCat': [],
                'maxId': 0
            }
            self.writeJSONFile('error', data)

    def writeJSONFile(self, filename, data):
        with open(os.path.join(self.path_s, filename + ".json"), "w") as f:
            f.write(json.dumps(data, indent=3))

    def readJSONFile(self, filename):
        with open(os.path.join(self.path_s, filename + '.json'), "r") as f:
            data = json.load(f)
        return data
#--------------- HELP FUNCTIONS
    #Check if a provide string is an int value
    def isNumber(self, string):
        try:
            int(string)
            return True
        except:
            return False

    # Calculate the next id for a new project
    def getNextID(self, filename):
        return self.readJSONFile(filename)['maxId'] + 1

    #Function to get a single entry of a type/file
    def getById(self, filename, id):
        if not self.isNumber(id):
            return None

        #Only read the data dict
        data = self.readJSONFile(filename)['data']

        #Check all entrys if one entry has the searched id
        for entry in data:
            if int(id) == entry['id']:
                return entry
        return None

#--------------- Project Functions
    #return all projects and their components
    def getAllProjects(self):
        return self.readJSONFile('project')['projects']

    #return one project and its components
    def getProjectById(self, id):
        if not self.isNumber(id):
            return None

        #Only read the projects dict
        data = self.getAllProjects()

        #Check all entrys if one entry has the searched id
        for entry in data:
            if int(id) == entry['id']:
                return entry
        return None

    #create a new project and return its id
    #returns the id of the new project
    def createProject(self, name, desc):
        #get the next available ID
        newId = self.getNextID('project')

        #get the whole content of the project file
        data = self.readJSONFile('project')

        #create a new entry
        newEntry = {
            "id": newId,
            "name": name,
            "desc": desc,
            "component": []
        }

        #append the data array with the new entry
        data['projects'].append(newEntry)
        #set the new maxId
        data['maxId'] = newId

        #save all changes to the json file
        self.writeJSONFile('project', data)
        return newId

    #update a project with the given id
    #returns True if it was successful
    #returns False if it was unsuccessful
    def updateProject(self, id, name, desc):
        #Check if the provided id is an int value
        if not self.isNumber(id):
            return False

        #Check if the searched project exist
        if self.getProjectById(id) is None:
            return False

        #get the current file/projects
        data = self.readJSONFile('project')

        #find the searched project and replace the information
        for entry in data['projects']:
            if entry['id'] == int(id):
                entry['name'] = name
                entry['desc'] = desc
                break

        #save the new data to the file
        self.writeJSONFile('project', data)
        return True

    #Delete the project of the given id
    # returns True if it was successful
    # returns False if it was unsuccessful
    def deleteProject(self, id):
        # Check if the provided id is an int value
        if not self.isNumber(id):
            return False

        # Check if the searched project exist
        if self.getProjectById(id) is None:
            return False

        # get the current file/projects
        jsonFILE = self.readJSONFile('project')

        # create an array to save projects which should not be deleted
        data = []

        #Iterate only through the projects array of the projects
        for entry in jsonFILE['projects']:
            # Save all projects in the data array, but not the project with the given id
            if not entry['id'] == int(id):
                data.append(entry)

        #Set the data array as the new projects array in the "jsonFile"
        jsonFILE['projects'] = data

        #save the new json file to disk
        self.writeJSONFile('project', jsonFILE)
        return True

#-------------------- Functions

#EOF