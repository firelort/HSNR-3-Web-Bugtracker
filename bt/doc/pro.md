# Web-Engineering Praktikum 2
## Einleitung
Der “Bug-Tracker” stellt ein Hilfsmittel bei der Qualitätssicherung von Software-Entwicklungsprojekten dar:
Erkannte Mängel werden protokolliert und weitere Bearbeitungsvorgänge zur Beseitigung der Mängel angestoßen.
Die Behebung dieser Mängel wird ebenfalls protokolliert, und kann von einem QS-Mitarbeiter abgelehnt werden.

## Implementierung des Servers
### REST-Interface
Jedes Modul/Jede Adresse nutzt statt des Object-Dispatching das Method-Disptaching, sodass jeweils die benötigten Methoden zur Verfügung gestellt werden. Diese sind, sofern benötigt, GET PUT POST DELETE. Der Server sendet alle seine Daten, auch die Fehler Meldungen, im JSON-Format zurück an den Requester, beispielsweise dem Web-Client, aber auch jedem anderen Agent.

### Module
### database.py
Das Datenbank Modul stellt die Schnittstelle zwischen der Datenhaltung und der Applikation dar. In diesem Modul sind alle Funktionen enthalten, um Daten aus der Datenhaltung zu holen, diese zu verändern, diese zu löschen. Auch können so neue Datensätze angelegt werden.

### employee.py
Dieses Modul stellt die Schnittstellen für die Adressen swentwickler/ und qsmitarbeiter/ bereit. Hier werden die verschiedenen Methoden für die Agentes exposed. Die Methoden übergeben die übergebenen Daten, dann an die jeweiligen Funktionen in der database.py. Falls es Fehler in der database.py auftretten, werden dementsprechen Fehlermeldungen an den Client zurück gesendet.

### error.py
Dieses Modul sellt die Schnittstellen für die Adressen fehler/ und loesung/ sowie für die katfehler/ und katursache/ bereit. Hier werden die verschiedenen Methoden für die Agentes exposed. Die Methoden übergeben die übergebenen Daten, dann an die jeweiligen Funktionen in der database.py. Falls es Fehler in der database.py auftretten, werden dementsprechen Fehlermeldungen an den Client zurück gesendet.

### login.py
Dieses Modul stellt die Schnitstelle für den Login bereit, sodass der Client an den Server einen Namen senden kann und dieser dann durch die database.py geprüft werden kann, fall es einen Nutzer mit diesem Nutzernamen gibt wird die RollenID sowie der Nutzername zurück gegeben.


### navigation.py
Dieses Modul stellt die Schnittstelle für die Navigation bereit und sendet anhand der mitgesendeten RollenID ein anderes Navigationsobjekt.

### project.py
Dieses Modul stellt die Schnittstelle für projekt/, projektkomponenten/ und komponente/ bereit.
Hier werden die verschiedenen Methoden für die Agentes exposed. Die Methoden übergeben die übergebenen Daten, dann an die jeweiligen Funktionen in der database.py. Falls es Fehler in der database.py auftretten, werden dementsprechen Fehlermeldungen an den Client zurück gesendet.

### role.py
Dieses Modul stellt nur die Schnittstelle nur für die GET Methode für die Rollen bereit, sodass sich Agents die Liste von Rollen holen können.

### template.py
Dieses Modul stellt die Schnittstelle bereit, damit Clients sich alle Templates vom Server holen können.


### Datenhaltung

Die Daten sind in 3 JSON Files gespeichert.

In der error.json befinden sich die Fehler, die Lösungen sowie die jeweiligen Kategorien.
In der project.json befinden sich die Projekte und deren Komponenten.
In der employee.json befinden sich die Mitarbeiter, sowie deren Rollen.

Verweise auf andere Komponenten, Projekte, Kategorien, Rollen, etc sind mithilfe der entsprechenden IDs realisert. Beispielsweise sind die Komponenten eines Projektes in einem Integer Array/Liste gespeichert.
Diese trifft auch auf die anderen Daten zu, wenn es eine Beziehung zwischen den Daten gibt.
## Implementierung des Clients
### Klassen
Die JavaScript Funktionen sind in Dateien pro Funktion aufgeteilt, jede Datei implementiert mindestens eine Klasse, welche in der app.js genutzt wird. Pro Funktionalität existiert eine Klasse.


#### list.js

Diese Klasse stellt für alle anderen Klassen eine Renderfunktion sowie eine configEventHanlder Funktion für die Listenansicht bereit.

#### edit.js

Diese Klasse stellt für alle anderen Klassen eine Renderfunktion sowie eine configEventHanlder Funktion für die Bearbeitungsansicht bereit.

#### view.js

Diese Klasse stellt für alle anderen Klassen eine Renderfunktion sowie eine configEventHanlder Funktion für die Einzelansicht bereit.
