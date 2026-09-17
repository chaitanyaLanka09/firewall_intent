const mongoose = require('mongoose');
const dotenv = require('dotenv');
const App = require('./models/App');
const PermissionRequest = require('./models/PermissionRequest');
const BlackBoxEvent = require('./models/BlackBoxEvent');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/app_intent_firewall');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedApps = [
  {
    name: 'Calculator',
    packageName: 'com.demo.calculator',
    category: 'Utility',
    normalPermissions: [],
    permissionUsage: {
      CAMERA: 0,
      MICROPHONE: 0,
      LOCATION: 0,
      CONTACTS: 0,
      FILES: 0
    },
    baselineBehavior: {
      backgroundActivity: 'LOW',
      networkActivity: 'LOW',
      cpuActivity: 'LOW',
      batteryActivity: 'LOW'
    }
  },
  {
    name: 'Camera',
    packageName: 'com.demo.camera',
    category: 'Photography',
    normalPermissions: ['CAMERA'],
    permissionUsage: {
      CAMERA: 25,
      MICROPHONE: 2,
      LOCATION: 5,
      CONTACTS: 0,
      FILES: 10
    },
    baselineBehavior: {
      backgroundActivity: 'LOW',
      networkActivity: 'NORMAL',
      cpuActivity: 'NORMAL',
      batteryActivity: 'NORMAL'
    }
  },
  {
    name: 'Notes',
    packageName: 'com.demo.notes',
    category: 'Productivity',
    normalPermissions: ['FILES'],
    permissionUsage: {
      CAMERA: 0,
      MICROPHONE: 2,
      LOCATION: 0,
      CONTACTS: 0,
      FILES: 15
    },
    baselineBehavior: {
      backgroundActivity: 'LOW',
      networkActivity: 'LOW',
      cpuActivity: 'NORMAL',
      batteryActivity: 'NORMAL'
    }
  }
];

const seedDatabase = async () => {
  await connectDB();
  
  try {
    await App.deleteMany();
    await PermissionRequest.deleteMany();
    await BlackBoxEvent.deleteMany();
    console.log('Data cleared...');
    
    await App.insertMany(seedApps);
    console.log('Seed data imported...');
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();
