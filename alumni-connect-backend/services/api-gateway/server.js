import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;
const NODE_SERVICE_URL = process.env.NODE_SERVICE_URL || 'http://localhost:4001/graphql';
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:4002/graphql';
const PHP_SERVICE_URL = process.env.PHP_SERVICE_URL || 'http://localhost:4003/graphql';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

console.log('\n🔍 Gateway Configuration:');
console.log('   Port:', PORT);
console.log('   Node Service:', NODE_SERVICE_URL);
console.log('   Python Service:', PYTHON_SERVICE_URL);
console.log('   PHP Service:', PHP_SERVICE_URL);
console.log('');

// Health check
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    service: 'api-gateway',
    port: PORT,
    subgraphs: {}
  };

  // Check Node.js service
  try {
    const nodeHealthUrl = NODE_SERVICE_URL.replace('/graphql', '/health');
    const nodeResponse = await fetch(nodeHealthUrl);
    health.subgraphs['identity-service'] = nodeResponse.ok ? 'healthy' : 'unhealthy';
  } catch (error) {
    health.subgraphs['identity-service'] = 'unreachable';
  }

  // Check Python service
  try {
    const pythonHealthUrl = PYTHON_SERVICE_URL.replace('/graphql', '/health');
    const pythonResponse = await fetch(pythonHealthUrl);
    health.subgraphs['event-service'] = pythonResponse.ok ? 'healthy' : 'unhealthy';
  } catch (error) {
    health.subgraphs['event-service'] = 'unreachable';
  }

  // Check PHP service
  try {
    const phpHealthUrl = PHP_SERVICE_URL.replace('/graphql', '');
    const phpResponse = await fetch(phpHealthUrl);
    health.subgraphs['funding-service'] = phpResponse.ok ? 'healthy' : 'unhealthy';
  } catch (error) {
    health.subgraphs['funding-service'] = 'unreachable';
  }

  res.json(health);
});

// GraphQL proxy endpoint
// GraphQL proxy endpoint
app.post('/graphql', async (req, res) => {
  const { query, variables, operationName } = req.body;

  // Get authorization header (try both cases)
  const authorization =
    req.headers.authorization ||
    req.headers.Authorization ||
    '';

  console.log('\n📨 ===== GATEWAY REQUEST =====');
  console.log('Operation:', operationName || 'unnamed');
  console.log('Authorization header:', authorization ? `✅ Present (${authorization.substring(0, 30)}...)` : '❌ MISSING');
  console.log('Headers received:', Object.keys(req.headers));

  // Determine which service to route to
  const queryString = query || '';
  const isEventQuery =
    queryString.includes('createEvent') ||
    queryString.includes('updateEvent') ||
    queryString.includes('deleteEvent') ||
    queryString.includes('events') ||
    queryString.includes('Event') ||
    queryString.includes('registerEvent') ||
    queryString.includes('cancelRegistration') ||
    queryString.includes('myRegistrations');

  const isFundingQuery =
    queryString.includes('campaign') ||
    queryString.includes('Campaign') ||
    queryString.includes('donation') ||
    queryString.includes('Donation') ||
    queryString.includes('myCampaigns') ||
    queryString.includes('myDonations') ||
    queryString.includes('donateToCampaign') ||
    queryString.includes('addCampaignUpdate');

  let targetUrl, serviceName;
  if (isFundingQuery) {
    targetUrl = PHP_SERVICE_URL;
    serviceName = 'PHP Funding Service';
  } else if (isEventQuery) {
    targetUrl = PYTHON_SERVICE_URL;
    serviceName = 'Python Event Service';
  } else {
    targetUrl = NODE_SERVICE_URL;
    serviceName = 'Node.js Identity Service';
  }

  console.log('Routing to:', serviceName);
  console.log('Target URL:', targetUrl);

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization, // Forward exactly as received
      },
      body: JSON.stringify({ query, variables, operationName })
    });

    const data = await response.json();

    if (data.errors) {
      console.error('❌ Errors from', serviceName);
      data.errors.forEach(err => {
        console.error('   -', err.message);
      });
    } else {
      console.log('✅ Success from', serviceName);
    }
    console.log('===== END GATEWAY REQUEST =====\n');

    res.status(response.status).json(data);
  } catch (error) {
    console.error('❌ Gateway fetch error:', error.message);
    res.status(500).json({
      errors: [{
        message: `Failed to reach ${serviceName}: ${error.message}`,
        extensions: { code: 'SERVICE_UNAVAILABLE' }
      }]
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Alumni Connect - API Gateway',
    version: '1.0.0',
    graphql: '/graphql',
    health: '/health',
  });
});

app.listen(PORT, () => {
  console.log(`\n✅ API Gateway running at http://localhost:${PORT}`);
  console.log(`📊 GraphQL Endpoint: http://localhost:${PORT}/graphql`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health\n`);
});