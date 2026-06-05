const axios = require('axios');

// CORS Test Script
const testCORS = async () => {
  const baseURL = process.env.TEST_URL || 'http://localhost:5001';
  
  console.log('🧪 Testing CORS Configuration...\n');
  
  const testOrigins = [
    'https://puthan-kada.vercel.app',
    'https://admin.puthan-kada.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'https://invalid-origin.com'
  ];

  for (const origin of testOrigins) {
    try {
      console.log(`Testing origin: ${origin}`);
      
      // Test OPTIONS request (preflight)
      const optionsResponse = await axios.options(`${baseURL}/api`, {
        headers: {
          'Origin': origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type, Authorization'
        },
        timeout: 5000
      });
      
      console.log(`✅ OPTIONS request successful for ${origin}`);
      console.log(`   Status: ${optionsResponse.status}`);
      console.log(`   Headers: ${JSON.stringify(optionsResponse.headers)}\n`);
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ CORS blocked for ${origin}`);
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Message: ${error.response.data?.message || error.message}\n`);
      } else {
        console.log(`⚠️  Connection error for ${origin}: ${error.message}\n`);
      }
    }
  }
};

// Run the test
testCORS().catch(console.error);

module.exports = testCORS;