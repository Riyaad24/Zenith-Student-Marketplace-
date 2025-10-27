// Test the auth service login to see what's being returned
const AuthService = require('./lib/auth-service').default

async function testLogin() {
  try {
    console.log('Testing login with admin credentials...')
    
    const result = await AuthService.login({
      email: '402306532ads@my.richfield.ac.za',
      password: 'password123'
    })
    
    console.log('Login result:')
    console.log('- Success:', !!result)
    console.log('- User ID:', result.user?.id)
    console.log('- User Email:', result.user?.email)
    console.log('- User Roles:', result.user?.roles)
    console.log('- Redirect To:', result.user?.redirectTo)
    console.log('- Token exists:', !!result.token)
    
  } catch (error) {
    console.error('Login test failed:', error.message)
  }
}

testLogin()