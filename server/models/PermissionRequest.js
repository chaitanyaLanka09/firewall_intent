const mongoose = require('mongoose');

const permissionRequestSchema = new mongoose.Schema({
  appId: { type: mongoose.Schema.Types.ObjectId, ref: 'App', required: true },
  appName: { type: String, required: true },
  permission: { type: String, required: true },
  context: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String },
  riskScore: { type: Number },
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
  recommendation: { type: String, enum: ['ALLOW', 'ASK', 'BLOCK'] },
  scoreBreakdown: {
    permissionSensitivity: Number,
    contextMismatch: Number,
    historicalAnomaly: Number,
    permissionCombination: Number,
    behavioralChange: Number,
    deviceEvidence: Number
  },
  explanation: { type: String },
  reasons: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('PermissionRequest', permissionRequestSchema);
