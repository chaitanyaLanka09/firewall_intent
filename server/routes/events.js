const express = require('express');
const router = express.Router();
const BlackBoxEvent = require('../models/BlackBoxEvent');

// GET /api/events - Get all events
router.get('/', async (req, res) => {
  try {
    const { appId } = req.query;
    const filter = appId ? { appId } : {};
    
    const events = await BlackBoxEvent.find(filter)
      .sort({ timestamp: -1 })
      .limit(50);
      
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/events - Create new event (for testing)
router.post('/', async (req, res) => {
  try {
    const event = new BlackBoxEvent(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
