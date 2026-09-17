const express = require('express');
const router = express.Router();
const App = require('../models/App');

// GET /api/apps - Get all apps
router.get('/', async (req, res) => {
  try {
    const apps = await App.find({});
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/apps/:id - Get single app
router.get('/:id', async (req, res) => {
  try {
    const app = await App.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'App not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
