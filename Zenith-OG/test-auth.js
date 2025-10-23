// Test authentication with our Richfield student credentials
async function testLogin() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: '402302567@my.richfield.ac.za',
        password: 'password123'
      })
    });

    const result = await response.json();
    console.log('Login response:', result);

    if (response.ok) {
      console.log('✅ Login successful!');
      
      // Test getting user info
      const userResponse = await fetch('http://localhost:3000/api/auth/me', {
        method: 'GET',
        credentials: 'include'
      });
      
      const userData = await userResponse.json();
      console.log('User data:', userData);
      
      if (userResponse.ok) {
        console.log('✅ User authentication check successful!');
        console.log('User:', userData.user);
      } else {
        console.log('❌ User authentication check failed:', userData.error);
      }
    } else {
      console.log('❌ Login failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testLogin();