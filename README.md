# Task Manager API

Eine RESTful API für eine Task-Management-Anwendung, entwickelt mit Node.js, Express und MongoDB.

## Funktionen

- Benutzerauthentifizierung (Registrierung und Login)
- JWT-basierte Autorisierung
- CRUD-Operationen für Projekte
- CRUD-Operationen für Aufgaben
- Verknüpfung von Aufgaben mit Projekten
- Suche nach Projekten

## Installation

1. Klonen Sie das Repository
2. Führen Sie `npm install` aus, um die Abhängigkeiten zu installieren
3. Erstellen Sie eine `.env`-Datei und fügen Sie folgende Variablen hinzu
4. 4. Starten Sie den Server mit `npm start`

## API-Endpunkte

### Authentifizierung
- POST /api/auth/register - Neuen Benutzer registrieren
- POST /api/auth/login - Benutzer anmelden

### Projekte
- GET /api/projects - Alle Projekte des Benutzers abrufen
- POST /api/projects - Neues Projekt erstellen
- PUT /api/projects/:id - Projekt aktualisieren
- DELETE /api/projects/:id - Projekt löschen
- GET /api/projects/search?query=suchbegriff - Projekte suchen

### Aufgaben
- GET /api/tasks/:projectId - Alle Aufgaben eines Projekts abrufen
- POST /api/tasks/:projectId - Neue Aufgabe erstellen
- PUT /api/tasks/:id - Aufgabe aktualisieren
- DELETE /api/tasks/:id - Aufgabe löschen

## Zukünftige Erweiterungen

- Implementierung von Unit- und Integrationstests
- Hinzufügen von Paginierung für Projekt- und Aufgabenlisten
- Erweiterte Suchfunktionen für Aufgaben
- Implementierung von Benutzerrollen und Berechtigungen
