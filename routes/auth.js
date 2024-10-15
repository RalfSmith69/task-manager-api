// routes/tasks.js
const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const auth = require('../middleware/auth'); // Middleware importieren

const router = express.Router();

// Erstellen einer neuen Aufgabe (nur für authentifizierte Benutzer)
router.post('/:projectId', auth, async (req, res) => {
  const { title, description, status } = req.body;
  const { projectId } = req.params;

  try {
    // Prüfen, ob das Projekt existiert
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Projekt nicht gefunden' });
    }

    // Neue Aufgabe erstellen
    const task = new Task({
      title,
      description,
      status,
      project: projectId
    });

    // Logge die Aufgabe zur Überprüfung
    console.log("Neue Aufgabe:", task);

    // Aufgabe speichern
    await task.save();

    // Aufgabe dem Projekt hinzufügen
    project.tasks.push(task._id);
    await project.save();

    // Rückgabe der erstellten Aufgabe
    res.status(201).json(task);
  } catch (error) {
    console.error("Fehler beim Erstellen der Aufgabe:", error);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Alle Aufgaben eines Projekts abrufen (nur für authentifizierte Benutzer)
router.get('/:projectId', auth, async (req, res) => {
  const { projectId } = req.params;

  try {
    const tasks = await Task.find({ project: projectId });
    if (!tasks.length) {
      return res.status(404).json({ message: 'Keine Aufgaben gefunden' });
    }

    res.json(tasks);
  } catch (error) {
    console.error("Fehler beim Abrufen der Aufgaben:", error);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Aufgabe aktualisieren (nur für authentifizierte Benutzer)
router.put('/:id', auth, async (req, res) => {
  const { title, description, status } = req.body;

  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Aufgabe nicht gefunden' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    // Aufgabe speichern
    await task.save();

    res.json(task);
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Aufgabe:", error);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Aufgabe löschen (nur für authentifizierte Benutzer)
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Aufgabe nicht gefunden' });
    }

    res.json({ message: 'Aufgabe gelöscht' });
  } catch (error) {
    console.error("Fehler beim Löschen der Aufgabe:", error);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

module.exports = router;
