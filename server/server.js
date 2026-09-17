const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB().then(async () => {
  const App = require('./models/App');
  const count = await App.countDocuments();
  if (count === 0) {
    console.log("Database is empty. Populating with seed data...");
    const seedApps = [
      {
        name: 'Calculator', packageName: 'com.demo.calculator', category: 'Utility', normalPermissions: [],
        permissionUsage: { CAMERA: 0, MICROPHONE: 0, LOCATION: 0, CONTACTS: 0, FILES: 0 },
        baselineBehavior: { backgroundActivity: 'LOW', networkActivity: 'LOW', cpuActivity: 'LOW', batteryActivity: 'LOW' }
      },
      {
        name: 'Camera', packageName: 'com.demo.camera', category: 'Photography', normalPermissions: ['CAMERA'],
        permissionUsage: { CAMERA: 25, MICROPHONE: 2, LOCATION: 5, CONTACTS: 0, FILES: 10 },
        baselineBehavior: { backgroundActivity: 'LOW', networkActivity: 'NORMAL', cpuActivity: 'NORMAL', batteryActivity: 'NORMAL' }
      },
      {
        name: 'Notes', packageName: 'com.demo.notes', category: 'Productivity', normalPermissions: ['FILES'],
        permissionUsage: { CAMERA: 0, MICROPHONE: 2, LOCATION: 0, CONTACTS: 0, FILES: 15 },
        baselineBehavior: { backgroundActivity: 'LOW', networkActivity: 'LOW', cpuActivity: 'NORMAL', batteryActivity: 'NORMAL' }
      }
    ];
    await App.insertMany(seedApps);
    console.log("Seed data successfully populated.");
  }
});

const app = express();

// Middleware
app.use(express.json());
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');
    // Allow localhost, exact matches from FRONTEND_URL, or any Vercel preview deployment
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Routes
app.use('/api/apps', require('./routes/apps'));
app.use('/api/analysis', require('./routes/analysis'));
app.use('/api/events', require('./routes/events'));
app.use('/api/demo', require('./routes/demo'));

// Dashboard route (for simple metrics)
app.get('/api/dashboard', async (req, res) => {
  try {
    const App = require('./models/App');
    const PermissionRequest = require('./models/PermissionRequest');
    const BlackBoxEvent = require('./models/BlackBoxEvent');
    
    const totalApps = await App.countDocuments();
    const activeAlerts = await PermissionRequest.countDocuments({ recommendation: 'BLOCK' });
    const behaviorChanges = await PermissionRequest.countDocuments({ 'scoreBreakdown.behavioralChange': { $gt: 0 } });
    const highRiskEvents = await BlackBoxEvent.countDocuments({ severity: { $in: ['HIGH', 'CRITICAL'] } });
    
    const recentActivity = await PermissionRequest.find().sort({ timestamp: -1 }).limit(10).populate('appId', 'name');
    const apps = await App.find().limit(5);
    
    res.json({
      totalApps,
      activeAlerts,
      behaviorChanges,
      highRiskEvents,
      recentActivity,
      apps
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
