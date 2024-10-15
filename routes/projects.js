const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth'); // Import der Authentifizierungsmiddleware
const router = express.Router();

// Erstellen eines neuen Projekts
router.post('/', auth, async (req, res) => {
  const { name, description } = req.body;
  try {
    const project = new Project({
      name,
      description,
      owner: req.user
    });

    // Projekt speichern
    await project.save();
    
    // Rückgabe des erstellten Projekts
    res.status(201).json(project);
  } catch (error) {
    console.error('Fehler beim Erstellen des Projekts:', error);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Alle Projekte des Benutzers abrufen
router.get('/', auth, async (req, res) => {
  try {
    // Abrufen aller Projekte des Benutzers basierend auf der User-ID
    const projects = await Project.find({ owner: req.user });
    
    // Wenn keine Projekte gefunden werden
    if (!projects.length) {
      return res.status(404).json({ message: 'Keine Projekte gefunden' });
    }
    
    // Rückgabe der gefundenen Projekte
    res.json(projects);
  } catch (error) {
    console.error('Fehler beim Abrufen der Projekte:', error);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Projekte nach Namen durchsuchen
router.get('/search', auth, async (req, res) => {
  const { query } = req.query;
  try {
    // Projekte nach Name durchsuchen (Regulärer Ausdruck, um Teilsuchen zu ermöglichen)
    const projects = await Project.find({
      owner: req.user,
      name: { $regex: query, $options: 'i' } // 'i' für case-insensitive Suche
    });
    
    // Rückgabe der gefundenen Projekte
    res.json(projects);
  } catch (error) {
    console.error('Fehler beim Suchen der Projekte:', error);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Projekt aktualisieren
router.put('/:id', auth, async (req, res) => {
  const { name, description } = req.body;
  try {
    // Finden des Projekts, das dem Benutzer gehört und aktualisiert werden soll
    let project = await Project.findOne({ _id: req.params.id, owner: req.user });
    
    // Wenn das Projekt nicht gefunden wird
    if (!project) {
      return res.status(404).json({ message: 'Projekt nicht gefunden' });
    }

    // Aktualisierung der Felder, falls übergeben
    project.name = name || project.name;
    project.description = description || project.description;

    // Speichern der Änderungen
    await project.save();

    // Rückgabe des aktualisierten Projekts
    res.json(project);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Projekts:', error);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Projekt löschen
router.delete('/:id', auth, async (req, res) => {
  try {
    // Finden des Projekts, das gelöscht werden soll
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user });

    // Wenn das Projekt nicht gefunden wird
    if (!project) {
      return res.status(404).json({ message: 'Projekt nicht gefunden' });
    }

    // Rückgabe einer Erfolgsmeldung
    res.json({ message: 'Projekt gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Projekts:', error);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

module.exports = router;
