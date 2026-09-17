const mongoose = require('mongoose');

const blackBoxEventSchema = new mongoose.Schema({
  appId: { type: mongoose.Schema.Types.ObjectId, ref: 'App', required: true },
  appName: { type: String, required: true },
  eventType: { 
    type: String, 
    enum: [
      'PERMISSION_REQUESTED', 
      'PERMISSION_GRANTED', 
      'PERMISSION_DENIED', 
      'APP_BACKGROUND', 
      'APP_FOREGROUND', 
      'CPU_INCREASE', 
      'NETWORK_INCREASE', 
      'BATTERY_INCREASE', 
      'SENSITIVE_RESOURCE_ACCESS'
    ],
    required: true 
  },
  value: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'LOW' }
}, { timestamps: true });

module.exports = mongoose.model('BlackBoxEvent', blackBoxEventSchema);
