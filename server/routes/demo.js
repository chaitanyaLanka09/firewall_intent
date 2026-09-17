const express = require('express');
const router = express.Router();
const App = require('../models/App');
const BlackBoxEvent = require('../models/BlackBoxEvent');
const axios = require('axios');

const runAnalysis = async (req, appId, permission, context) => {
  const url = `http://localhost:${process.env.PORT || 5000}/api/analysis/analyze`;
  const response = await axios.post(url, { appId, permission, context });
  return response.data;
};

// POST /api/demo/safe
router.post('/safe', async (req, res) => {
  try {
    const cameraApp = await App.findOne({ name: 'Camera' });
    if (!cameraApp) return res.status(404).json({ error: 'Camera app not found' });
    
    // Clear recent events for demo
    await BlackBoxEvent.deleteMany({ appId: cameraApp._id });
    
    const result = await runAnalysis(req, cameraApp._id, 'CAMERA', 'TAKING_PHOTO');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/demo/suspicious
router.post('/suspicious', async (req, res) => {
  try {
    const calcApp = await App.findOne({ name: 'Calculator' });
    if (!calcApp) return res.status(404).json({ error: 'Calculator app not found' });
    
    await BlackBoxEvent.deleteMany({ appId: calcApp._id });
    
    const now = Date.now();
    await BlackBoxEvent.create([
      {
        appId: calcApp._id,
        appName: calcApp.name,
        eventType: 'APP_BACKGROUND',
        timestamp: new Date(now - 15000),
        severity: 'MEDIUM'
      },
      {
        appId: calcApp._id,
        appName: calcApp.name,
        eventType: 'NETWORK_INCREASE',
        timestamp: new Date(now - 5000),
        severity: 'HIGH'
      }
    ]);
    
    const result = await runAnalysis(req, calcApp._id, 'MICROPHONE', 'CALCULATING');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
