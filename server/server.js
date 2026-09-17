const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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
