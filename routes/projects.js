const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
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
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Alle Projekte des Benutzers abrufen
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Projekt aktualisieren
router.put('/:id', auth, async (req, res) => {
  const { name, description } = req.body;
  try {
    let project = await Project.findOne({ _id: req.params.id, owner: req.user });
    if (!project) {
      return res.status(404).json({ message: 'Projekt nicht gefunden' });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Projekt löschen
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user });
    if (!project) {
      return res.status(404).json({ message: 'Projekt nicht gefunden' });
    }
    res.json({ message: 'Projekt gelöscht' });
  } catch (error) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Projekte suchen
router.get('/search', auth, async (req, res) => {
  const { query } = req.query;
  try {
    const projects = await Project.find({
      owner: req.user,
      name: { $regex: query, $options: 'i' }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Serverfehler' });
  }
});

module.exports = router;