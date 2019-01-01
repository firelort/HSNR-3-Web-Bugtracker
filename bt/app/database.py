import os
import json
import datetime

class Database_cl(object):
    def __init__(self, path):
        self.path_s = os.path.join(path, "data")
        self.initJSON()

    # -------------- JSON FILE
    def initJSON(self):
        file_s = os.path.join(self.path_s, 'employee.json')
        data = {}
        if not os.path.isfile(file_s):
            data = {
                "employees": [],
                "roles": [{
                    "id": 1,
                    "name": "qs",
                    "desc": "QS-Mitarbeiter"
                },
                    {
                        "id": 2,
                        "name": "se",
                        "desc": "SE-Mitarbeiter"
                    }],
                "maxId": 0,
                "maxRoleId": 2
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
                'errors': [],
                'results': [],
                'errorCat': [],
                'resultCat': [],
                'errMaxId': 0,
                'resMaxId': 0,
                'errCatMaxId': 0,
                'resCatMaxId': 0
            }
            self.writeJSONFile('error', data)

    def writeJSONFile(self, filename, data):
        with open(os.path.join(self.path_s, filename + ".json"), "w", encoding='utf-8') as f:
            f.write(json.dumps(data, indent=3, ensure_ascii=False))

    def readJSONFile(self, filename):
        with open(os.path.join(self.path_s, filename + '.json'), "r", encoding='utf-8') as f:
            data = json.load(f)
        return data

    # --------------- HELP FUNCTIONS
    # Check if a provide string is an int value
    def isNumber(self, string):
        try:
            int(string)
            return True
        except:
            return False

    # Calculate the next id for a new project
    def getNextID(self, filename):
        return self.readJSONFile(filename)['maxId'] + 1

    # Function to get a single entry of a type/file
    def getById(self, filename, id):
        if not self.isNumber(id):
            return None

        # Only read the data dict
        data = self.readJSONFile(filename)['data']

        # Check all entrys if one entry has the searched id
        for entry in data:
            if int(id) == entry['id']:
                return entry
        return None

    # --------------- Login Function
    def getRoleIdByUsername(self, username):
        users = self.getAllEmployees()

        for user in users:
            if user['username'] == username:
                return user['roleId']

        return None

    # --------------- Project Functions
    # return all projects and their components
    def getAllProjects(self):
        return self.readJSONFile('project')['projects']

    # return one project and its components
    def getProjectById(self, id):
        if not self.isNumber(id):
            return None

        # Only read the projects dict
        data = self.getAllProjects()

        # Check all entrys if one entry has the searched id
        for entry in data:
            if int(id) == entry['id']:
                return entry
        return None

    # create a new project and return its id
    # returns the id of the new project
    def createProject(self, name, desc):
        # get the next available ID
        newId = self.getNextID('project')

        # get the whole content of the project file
        data = self.readJSONFile('project')

        # create a new entry
        newEntry = {
            "id": newId,
            "name": name,
            "desc": desc,
            "component": []
        }

        # append the data array with the new entry
        data['projects'].append(newEntry)
        # set the new maxId
        data['maxId'] = newId

        # save all changes to the json file
        self.writeJSONFile('project', data)
        return newId

    # update a project with the given id
    # returns True if it was successful
    # returns False if it was unsuccessful
    def updateProject(self, id, name, desc):
        # Check if the provided id is an int value
        if not self.isNumber(id):
            return False

        # Check if the searched project exist
        if self.getProjectById(id) is None:
            return False

        # get the current file/projects
        data = self.readJSONFile('project')

        # find the searched project and replace the information
        for entry in data['projects']:
            if entry['id'] == int(id):
                entry['name'] = name
                entry['desc'] = desc
                break

        # save the new data to the file
        self.writeJSONFile('project', data)
        return True

    # Delete the project of the given id
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

        # Iterate only through the projects array of the projects
        for entry in jsonFILE['projects']:
            # Save all projects in the data array, but not the project with the given id
            if not entry['id'] == int(id):
                data.append(entry)
            else:
                components = entry['component']

        # Set the data array as the new projects array in the "jsonFile"
        jsonFILE['projects'] = data

        # Remove the project id from the different components
        for componentId in components:
            for entry in jsonFILE['components']:
                if componentId == entry['id']:
                    entry['project'].remove(int(id))

        # save the new json file to disk
        self.writeJSONFile('project', jsonFILE)
        return True

    # -------------------- Component Function
    # Get all components
    def getAllComponents(self):
        return self.readJSONFile('project')['components']

    # Get the Component of the given id
    def getComponentById(self, id):
        # Test if given id is an int value
        if not self.isNumber(id):
            return None

        # Get all Components
        data = self.getAllComponents()

        # Check all entrys if one entry has the searched id and return it
        for entry in data:
            if entry['id'] == int(id):
                return entry
        return None

    # Create a new component
    def createComponent(self, name, desc, projectids):
        # Get the whole content of the project file
        data = self.readJSONFile('project')

        # Get the id for the new component
        newId = data['maxCompId'] + 1

        # Test if projectids is an int or an array
        try:
            len(projectids)
            projects = [int(i) for i in projectids]
        except TypeError:
            projects = [projectids]

        # Create a new Entry
        newEntry = {
            "id": newId,
            "name": name,
            "desc": desc,
            "project": projects
        }

        # Append the component array with the new entry
        data['components'].append(newEntry)

        # Set the new maxCompId
        data['maxCompId'] = newId

        success = True
        # Add the component to the project component array
        for id in projects:
            exists = False
            for entry in data['projects']:
                if int(id) == entry['id']:
                    entry['component'].append(int(newId))
                    exists = True
                    break
            if not exists:
                success = False
                break

        if not success:
            return None
        # save all changes to the json file
        self.writeJSONFile('project', data)
        return newId

    # Update the component with the given id
    def updateComponent(self, id, name, desc, projectids):
        # Check if the id is an int value
        if not self.isNumber(id):
            return 1

        # Check if the id is an valid component
        if self.getComponentById(id) is None:
            return 1

        # Read the project json File
        data = self.readJSONFile('project')

        # Test if project ids is an int value or an array
        try:
            len(projectids)
            projects = [int(i) for i in projectids]
        except:
            projects = [projectids]

        # Find the searched components and replace the information
        for entry in data['components']:
            if entry['id'] == int(id):
                entry['name'] = name
                entry['desc'] = desc
                oldProjects = entry['project']
                entry['project'] = projects
                break

        # Delete the component from all projects
        for projectId in oldProjects:
            for entry in data['projects']:
                if int(projectId) == entry['id']:
                    entry['component'].remove(int(id))
                    break

        # Add the component to the new projects
        success = True
        # Add the component to the project component array
        for projectId in projects:
            exists = False
            for entry in data['projects']:
                if int(projectId) == entry['id']:
                    entry['component'].append(int(id))
                    exists = True
                    break
            if not exists:
                success = False
                break

        if not success:
            return 2

        # Save the json to the file
        self.writeJSONFile('project', data)
        return 0

    # Delete the component with the given id
    # and remove the id from the projects
    def deleteComponent(self, id):
        # Check if the given id is an int value
        if not self.isNumber(id):
            return False

        # Check if a component exists with the id
        if self.getComponentById(id) is None:
            return False

        # Get the current file
        data = self.readJSONFile('project')

        # Remove the component from the components array
        components = []
        for entry in data['components']:
            if not entry['id'] == int(id):
                components.append(entry)
            else:
                projects = entry['project']
        data['components'] = components

        # Remove the component id from the projects
        for projectEntry in data['projects']:
            for value in projects:
                if projectEntry['id'] == value:
                    projectEntry['component'].remove(int(id))

        # Save the changes to the file
        self.writeJSONFile('project', data)
        return True

    # -------------------- Employee Function
    def getAllEmployees(self):
        # return all employees
        return self.readJSONFile('employee')['employees']

    # Get the Employee of the given id
    def getEmployeeById(self, id):
        if not self.isNumber(id):
            return None

        # Only read the employee dict
        data = self.getAllEmployees()

        # Check all entrys if one entry has the searched id and return it
        for entry in data:
            if int(id) == entry['id']:
                return entry
        return None

    # create a new Employee with the given information
    def createEmployee(self, roleid, username, firstname, lastname, email, phone, address):
        # get the next aviable id
        newId = self.getNextID('employee')
        # get the whole content of the employee file
        data = self.readJSONFile('employee')
        # create a new entry / a new user for employees array
        entry = {
            "id": newId,
            "roleId": roleid,
            "username": username,
            "firstname": firstname,
            "lastname": lastname,
            "email": email,
            "phone": phone,
            "address": address
        }

        # append the entry to the employee array
        data['employees'].append(entry)

        # set the new maxId
        data['maxId'] = newId

        # save all changes in file
        self.writeJSONFile('employee', data)
        # return the id of the new employee
        return newId

    def updateEmployee(self, id, roleid, username, firstname, lastname, email, phone, address):
        # ceck if the id is an int value
        if not self.isNumber(id):
            return False

        # check if roleid is an int value
        if not self.isNumber(roleid):
            return False

        # check if the employee with the given id exists
        if self.getEmployeeById(id) is None:
            return False

        # get the employee file/ get all employees
        data = self.readJSONFile('employee')

        # check if a role with the given roleid exists
        exists = False
        for role in data['roles']:
            if role['id'] == int(roleid):
                exists = True
                break

        if not exists:
            return False

        # find the searched employee and update the inforamtion
        for entry in data['employees']:
            if entry['id'] == int(id):
                entry['roleId'] = int(roleid)
                entry['username'] = username
                entry['firstname'] = firstname
                entry['lastname'] = lastname
                entry['email'] = email
                entry['phone'] = phone
                entry['address'] = address
                break

        # save the new data to file
        self.writeJSONFile('employee', data)
        return True

    def deleteEmployee(self, id):
        # check if the given id is in an int value
        if not self.isNumber(id):
            return False

        # check if the Employee exists
        if self.getEmployeeById(id) is None:
            return False

        # get the current file/projects
        jsonFILE = self.readJSONFile('employee')

        # create an array to save projects which should not be deleted
        employee = []

        # Iterate only through the employee array of the projects
        for entry in jsonFILE['employees']:
            # Save all employees in the data array, but not the employee with the given id
            if not entry['id'] == int(id):
                employee.append(entry)

        # Set the employee array as the new employees array in the "jsonFile"
        jsonFILE['employees'] = employee

        # save the new json file to disk
        self.writeJSONFile('employee', jsonFILE)
        return True

    # -------------------- SoftwareDeveloper Functions

    def getAllSoftwareDeveloper(self):
        # get all Employee
        data = self.getAllEmployees()

        # create a Array for the SoftwareDeveloper
        softwareDeveloper = []

        # for each entry check if it has the right role id
        for entry in data:
            if entry['roleId'] == 2:
                # add the entry to the softwareDeveloper array if the role is softwaredeveloper
                softwareDeveloper.append(entry)
        # return all softwareDeveloper
        return softwareDeveloper

    def getSoftwareDeveloperById(self, id):
        # check if the provided id is an int value
        if not self.isNumber(id):
            return None

        # get the employee with the given id
        data = self.getEmployeeById(id)

        # check if a employee with the id exists
        if data is None:
            return None

        # check if the employee has the right role
        if data['roleId'] == 2:
            return data
        return None

    def createSoftwareDeveloper(self, username, fistname, lastname, email, phone, address):
        # create the new SoftwareDeveloper with the Employee Function and return the id of the employee
        return self.createEmployee(2, username, fistname, lastname, email, phone, address)

    # -------------------- QualityManagement Functions

    def getAllQualityManagement(self):
        # get all Employee
        data = self.getAllEmployees()

        # create a Array for the qualityManagement
        qualityManagement = []

        # for each entry check if it has the right role id
        for entry in data:
            if entry['roleId'] == 1:
                # add the entry to the qualityManagement array if the role is qualityManagement
                qualityManagement.append(entry)
        # return all softwareDeveloper
        return qualityManagement

    def getQualityManagementById(self, id):
        # check if the provided id is an int value
        if not self.isNumber(id):
            return None

        # get the employee with the given id
        data = self.getEmployeeById(id)

        # check if a employee with the id exists
        if data is None:
            return None

        # check if the employee has the right role
        if data['roleId'] == 1:
            return data
        return None

    def createQualityManagement(self, username, firstname, lastname, email, phone, address):
        # create the new QualityManagement with the Employee Function and return the id of the employee
        return self.createEmployee(1, username, fistname, lastname, email, phone, address)

    # -------------------- Error Category

    def getAllErrorCategories(self):
        return self.readJSONFile('error')['errorCat']

    def getErrorCategoryById(self, id):
        return 1

    def createErrorCategory(self):
        return 1

    def updateErrorCategory(self, id):
        return 1

    def deleteErrorCategory(self, id):
        return 1

    # -------------------- Result Category

    def getAllResultCategories(self):
        return 1

    def getResultCategoryById(self, id):
        return 1

    def createResultCateogry(self):
        return 1

    def updateResultCategory(self, id):
        return 1

    def deleteResultCategory(self, id):
        return 1

    # -------------------- Error Functions

    # Alle Fehler zurück geben
    def getAllErrors(self):
        return self.readJSONFile('error')['errors']

    def getErrorById(self, id):
        # Check if the given id is an int
        if not self.isNumber(id):
            return None

        # Only read the error dict
        data = self.getAllErrors()

        # Check all entrys if one entry has the searched id and return it
        for entry in data:
            if int(id) == entry['id']:
                return entry
        return None

    def getAllErrorsByType(self, type):
        # Alle Fehler die erkannt sind
        valideType = False

        if type == 'erkannt':
            valideType = True

        # Alle Fehler die behoben wurden
        elif type == 'behoben':
            valideType = True

        # Alle Fehler die erneut geöffnet wurden, da die alte Lösung nicht funktionert hat
        elif type == 'anderes':
            valideType = True

        # Falscher Type return None
        if not valideType:
            return None

        errors = self.getAllErrors()
        result = []

        for entry in errors:
            if entry['type'] == type:
                result.append(entry)

        return result

    def createNewError(self, desc, employee, components, categories):
        # Get the dict of the error file
        dictionary = self.readJSONFile('error')

        # Calculate the new ID and set the new max ID
        id = dictionary['errMaxId'] + 1
        dictionary['errMaxId'] = id

        # Check if the given categories are valid
        # Get all category IDS
        catList = []
        for entry in dictionary['errorCat']:
            catList.append(entry['id'])

        # Test if the given id is in the array
        for category in categories:
            if not int(category) in catList:
                return -1

        # Check if the given components are valid
        componentDict = self.getAllComponents()
        compList = []

        for entry in componentDict:
            compList.append(entry['id'])


        for component in components:
            if not int(component) in compList:
                return -2

        # Check if the given employee is valid
        employees = self.getAllQualityManagement()

        empList = []

        for data in employees:
            empList.append(data['id'])

        if not employee in empList:
            return -3

        # Convert the string arrays to an int arrays
        components = [int(i) for i in components]
        categories = [int(i) for i in categories]

        # Create new Entry
        entry = {
            'id': id,
            'desc': desc,
            'date': datetime.datetime.now().strftime('%d.%m.%Y - %H:%M'),
            'employee':  employee,
            'type': 'erkannt',
            'components': components,
            'categories': categories,
            'result': -1
        }

        # Append the new entry to the error array
        dictionary['errors'].append(entry)

        # Save the complete dictionary to the file
        self.writeJSONFile('error', dictionary)

        # Return the ID of the new error
        return id

    def updateError(self, id, desc, employee, components, categories):
        # Test if a error with the id exists
        if self.getErrorById(id) is None:
            return -4

        # Get the dict of the error file
        dictionary = self.readJSONFile('error')

        # Check if the given categories are valid
        # Get all category IDS
        catList = []
        for entry in dictionary['errorCat']:
            catList.append(entry['id'])

        # Test if the given id is in the array
        for category in categories:
            if not int(category) in catList:
                return -1

        # Check if the given components are valid
        componentDict = self.getAllComponents()
        compList = []

        for entry in componentDict:
            compList.append(entry['id'])

        for component in components:
            if not int(component) in compList:
                return -2

        # Check if the given employee is valid
        employees = self.getAllQualityManagement()
        print (employees)
        empList = []

        for data in employees:
            empList.append(data['id'])

        if not int(employee) in empList:
            return -3

        # Convert the string arrays to an int arrays
        components = [int(i) for i in components]
        categories = [int(i) for i in categories]

        # Find the error with the given id
        for entry in dictionary['errors']:
            if entry['id'] == int(id):
                print(id)
                # Change the content of the error
                entry['desc'] = desc
                entry['employee'] = employee
                entry['components'] = components
                entry['categories'] = categories
            print (entry)

        # Save the complete dictionary to the file
        self.writeJSONFile('error', dictionary)

        # Return the ID of the new error
        return True

    # ----------------------- Result Function
# EOF