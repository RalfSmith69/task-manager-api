// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

// Laden der Umgebungsvariablen aus .env
dotenv.config();

// Middleware zum Parsen von JSON
app.use(express.json());

// Cross-Origin Resource Sharing (CORS) aktivieren
app.use(cors());

// Verbindung zur MongoDB-Datenbank herstellen
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB verbunden'))
  .catch((err) => {
    console.error('MongoDB-Verbindung fehlgeschlagen:', err);
    process.exit(1); // Beendet den Server, wenn keine DB-Verbindung möglich ist
  });

// Routen einbinden
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects'); // Hier wird die Route für Projekte eingebunden
const taskRoutes = require('./routes/tasks');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes); // Überprüfe, ob diese Zeile vorhanden ist
app.use('/api/tasks', taskRoutes);

// Basis-Route für den Test der API
app.get('/', (req, res) => {
  res.send('API läuft...');
});

// Error-Handling für nicht gefundene Routen
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route nicht gefunden' });
});

// Error-Handling-Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Serverfehler' });
});

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
