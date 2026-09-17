const express = require('express');
const router = express.Router();
const App = require('../models/App');
const PermissionRequest = require('../models/PermissionRequest');
const BlackBoxEvent = require('../models/BlackBoxEvent');
const { calculateRisk } = require('../services/riskEngine');

// POST /api/analysis/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { appId, permission, context } = req.body;
    
    if (!appId || !permission || !context) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const app = await App.findById(appId);
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    // Get recent events (last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60000);
    const recentEvents = await BlackBoxEvent.find({
      appId: app._id,
      timestamp: { $gte: fiveMinutesAgo }
    }).sort({ timestamp: -1 });
    
    // Run risk engine
    const analysisResult = calculateRisk(app, permission, context, recentEvents);
    
    // Create PermissionRequest record
    const requestRecord = new PermissionRequest({
      appId: app._id,
      appName: app.name,
      permission,
      context,
      status: 'PROCESSED',
      riskScore: analysisResult.riskScore,
      riskLevel: analysisResult.riskLevel,
      recommendation: analysisResult.recommendation,
      scoreBreakdown: analysisResult.scoreBreakdown,
      explanation: analysisResult.reasons.join(' '),
      reasons: analysisResult.reasons
    });
    
    await requestRecord.save();
    
    // Also log this as an event
    await BlackBoxEvent.create({
      appId: app._id,
      appName: app.name,
      eventType: 'PERMISSION_REQUESTED',
      value: permission,
      severity: analysisResult.riskLevel
    });
    
    res.json({
      app: app.name,
      permission,
      context,
      riskScore: analysisResult.riskScore,
      riskLevel: analysisResult.riskLevel,
      recommendation: analysisResult.recommendation,
      behavioralChange: analysisResult.behavioralChange,
      scoreBreakdown: analysisResult.scoreBreakdown,
      reasons: analysisResult.reasons,
      blackBoxEvents: recentEvents
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
