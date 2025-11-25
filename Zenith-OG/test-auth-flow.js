/**
 * Authentication Flow Testing Script
 * Tests the complete authentication flow with the new secure configuration
 */

const API_URL = 'http://localhost:3000';
const FRONTEND_URL = 'http://localhost:3000';

// Test data
const testUser = {
  email: `test${Date.now()}@uct.ac.za`,
  password: 'TestPassword123',
  firstName: 'Test',
  lastName: 'User',
  university: 'University of Cape Town',
  phone: '+27123456789'
};

let authToken = null;

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers,
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

// Test 1: User Registration
async function testRegistration() {
  console.log('\n🔵 TEST 1: User Registration');
  console.log('─────────────────────────────────────────');
  console.log('Testing with:', testUser.email);
  
  const result = await apiCall('/api/auth/register', 'POST', testUser);
  
  if (result.status === 201 || result.status === 200) {
    console.log('✅ Registration successful');
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    // Extract token if provided
    if (result.data.token) {
      authToken = result.data.token;
      console.log('🔑 JWT Token received (length:', authToken.length, ')');
    }
    return true;
  } else {
    console.log('❌ Registration failed');
    console.log('Status:', result.status);
    console.log('Error:', JSON.stringify(result.data || result.error, null, 2));
    return false;
  }
}

// Test 2: User Login
async function testLogin() {
  console.log('\n🔵 TEST 2: User Login');
  console.log('─────────────────────────────────────────');
  console.log('Logging in with:', testUser.email);
  
  const result = await apiCall('/api/auth/login', 'POST', {
    email: testUser.email,
    password: testUser.password
  });
  
  if (result.status === 200) {
    console.log('✅ Login successful');
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    // Extract token
    if (result.data.token) {
      authToken = result.data.token;
      console.log('🔑 JWT Token received (length:', authToken.length, ')');
    }
    return true;
  } else {
    console.log('❌ Login failed');
    console.log('Status:', result.status);
    console.log('Error:', JSON.stringify(result.data || result.error, null, 2));
    return false;
  }
}

// Test 3: Get Current User (Protected Route)
async function testGetCurrentUser() {
  console.log('\n🔵 TEST 3: Get Current User (Protected Route)');
  console.log('─────────────────────────────────────────');
  
  if (!authToken) {
    console.log('⚠️  No auth token available, skipping test');
    return false;
  }
  
  const result = await apiCall('/api/auth/me', 'GET', null, authToken);
  
  if (result.status === 200) {
    console.log('✅ Successfully retrieved user data');
    console.log('User:', JSON.stringify(result.data, null, 2));
    return true;
  } else {
    console.log('❌ Failed to get user data');
    console.log('Status:', result.status);
    console.log('Error:', JSON.stringify(result.data || result.error, null, 2));
    return false;
  }
}

// Test 4: Access Protected Route - Products
async function testProductsRoute() {
  console.log('\n🔵 TEST 4: Protected Route - Products');
  console.log('─────────────────────────────────────────');
  
  if (!authToken) {
    console.log('⚠️  No auth token available, skipping test');
    return false;
  }
  
  const result = await apiCall('/api/products', 'GET', null, authToken);
  
  if (result.status === 200) {
    console.log('✅ Successfully accessed products route');
    console.log('Products count:', result.data.products ? result.data.products.length : 0);
    return true;
  } else {
    console.log('❌ Failed to access products route');
    console.log('Status:', result.status);
    console.log('Error:', JSON.stringify(result.data || result.error, null, 2));
    return false;
  }
}

// Test 5: Test JWT Token Validation
async function testInvalidToken() {
  console.log('\n🔵 TEST 5: Invalid Token Rejection');
  console.log('─────────────────────────────────────────');
  
  const fakeToken = 'invalid.jwt.token';
  const result = await apiCall('/api/auth/me', 'GET', null, fakeToken);
  
  if (result.status === 401 || result.status === 403) {
    console.log('✅ Invalid token correctly rejected');
    console.log('Status:', result.status);
    return true;
  } else {
    console.log('❌ Invalid token was not rejected properly');
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    return false;
  }
}

// Test 6: Check if secure config is being used
async function testConfigValidation() {
  console.log('\n🔵 TEST 6: Configuration Validation');
  console.log('─────────────────────────────────────────');
  
  // Try to login with wrong password to see error handling
  const result = await apiCall('/api/auth/login', 'POST', {
    email: testUser.email,
    password: 'WrongPassword123'
  });
  
  if (result.status === 401) {
    console.log('✅ Wrong password correctly rejected');
    console.log('Error message:', result.data.error || result.data.message);
    return true;
  } else {
    console.log('❌ Wrong password handling issue');
    console.log('Status:', result.status);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   ZENITH AUTHENTICATION FLOW TESTING                       ║');
  console.log('║   Testing JWT Authentication with Secure Configuration     ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  const results = {
    registration: false,
    login: false,
    getCurrentUser: false,
    productsRoute: false,
    invalidToken: false,
    configValidation: false
  };
  
  // Run tests sequentially
  try {
    results.registration = await testRegistration();
    
    // If registration successful, test login
    if (results.registration) {
      results.login = await testLogin();
    } else {
      // Registration might have failed because user exists, try login directly
      console.log('\n⚠️  Registration failed, attempting login with existing user...');
      results.login = await testLogin();
    }
    
    // If we have a token, test protected routes
    if (authToken) {
      results.getCurrentUser = await testGetCurrentUser();
      results.productsRoute = await testProductsRoute();
    }
    
    // Test invalid token rejection
    results.invalidToken = await testInvalidToken();
    
    // Test config validation
    results.configValidation = await testConfigValidation();
    
  } catch (error) {
    console.log('\n❌ Test suite error:', error.message);
    console.error(error);
  }
  
  // Print summary
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   TEST SUMMARY                                             ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  const tests = [
    { name: 'User Registration', result: results.registration },
    { name: 'User Login', result: results.login },
    { name: 'Get Current User', result: results.getCurrentUser },
    { name: 'Products Route Access', result: results.productsRoute },
    { name: 'Invalid Token Rejection', result: results.invalidToken },
    { name: 'Configuration Validation', result: results.configValidation }
  ];
  
  let passed = 0;
  let failed = 0;
  
  tests.forEach(test => {
    const status = test.result ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} - ${test.name}`);
    if (test.result) passed++;
    else failed++;
  });
  
  console.log('\n─────────────────────────────────────────');
  console.log(`Total: ${tests.length} tests`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success Rate: ${Math.round((passed / tests.length) * 100)}%`);
  
  if (passed === tests.length) {
    console.log('\n🎉 ALL TESTS PASSED! Authentication flow is working correctly.');
  } else if (passed > 0) {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
  } else {
    console.log('\n❌ All tests failed. Please check your configuration and server status.');
  }
  
  console.log('\n');
}

// Run the test suite
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
