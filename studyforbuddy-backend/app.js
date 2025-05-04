const express = require('express');
const cors = require('cors');  
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const os = require('os');
const pool = require('./config/db');
const app = express();
const path = require('path');
const swaggerDoc = YAML.load('./docs/swagger.yaml');
const professorRoutes = require('./routes/professorRoutes');
const studentRoutes = require('./routes/studentRoutes');
const classroomsRoutes = require('./routes/classroomsRoutes');
const classroomAllocationRoutes = require('./routes/classroomAllocationRoutes');
const jobRoutes = require('./routes/jobRoutes');
const jobApplication = require('./routes/jobApplicationRoutes');
const saveJob = require('./routes/saveJobRoute');

// Function to get the current machine's network IP address, prioritizing Wi-Fi
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  let ipAddress = 'localhost'; // Fallback in case no network interfaces are found

  // Check for Wi-Fi adapter
  if (interfaces['Wi-Fi']) {
    for (let iface of interfaces['Wi-Fi']) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ipAddress = iface.address;
        break;
      }
    }
  }

  // If no Wi-Fi adapter found, fall back to other adapters
  if (ipAddress === 'localhost') {
    for (let interfaceName in interfaces) {
      for (let iface of interfaces[interfaceName]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          ipAddress = iface.address;
          break;
        }
      }
    }
  }

  return ipAddress;
}

// Get the dynamic IP address
const localIP = getLocalIP();

// Add the server URL dynamically to Swagger documentation
swaggerDoc.servers = [
  {
    url: `http://${localIP}:3001/v1`, // Use the dynamic IP and port
    description: 'Local server'
  }
];

// Use CORS middleware for all origins and methods
app.use(cors({
  origin: '*',
  methods: '*',
  credentials: true
}));

// Body parser for JSON requests
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Serve the "uploads" folder as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/v1', professorRoutes);
app.use('/v1', studentRoutes);
app.use('/v1', classroomsRoutes);
app.use('/v1', classroomAllocationRoutes);
app.use('/v1', jobRoutes);
app.use('/v1', jobApplication);
app.use('/v1', saveJob);

// Health check route
app.get('/v1/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    console.log(rows);

    res.status(200).json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      database: rows ? 'Connected' : 'Disconnected',
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'DOWN',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Port
const port = 3001;
const host = '0.0.0.0';

app.listen(port, host, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Accessible on the network via: http://${localIP}:${port}`);
});
