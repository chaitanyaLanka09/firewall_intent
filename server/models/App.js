const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  name: { type: String, required: true },
  packageName: { type: String, required: true },
  category: { type: String, required: true },
  normalPermissions: [{ type: String }],
  permissionUsage: {
    CAMERA: { type: Number, default: 0 },
    MICROPHONE: { type: Number, default: 0 },
    LOCATION: { type: Number, default: 0 },
    CONTACTS: { type: Number, default: 0 },
    FILES: { type: Number, default: 0 }
  },
  baselineBehavior: {
    backgroundActivity: { type: String, enum: ['LOW', 'NORMAL', 'HIGH'], default: 'LOW' },
    networkActivity: { type: String, enum: ['LOW', 'NORMAL', 'HIGH'], default: 'LOW' },
    cpuActivity: { type: String, enum: ['LOW', 'NORMAL', 'HIGH'], default: 'LOW' },
    batteryActivity: { type: String, enum: ['LOW', 'NORMAL', 'HIGH'], default: 'LOW' }
  }
}, { timestamps: true });

module.exports = mongoose.model('App', appSchema);
