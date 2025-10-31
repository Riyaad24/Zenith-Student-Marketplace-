/**
 * Secure Configuration Module
 * 
 * This module provides type-safe access to environment variables and ensures
 * that critical secrets are properly configured before the application runs.
 * 
 * Security Best Practices:
 * - Never use fallback secrets in production
 * - Validate all environment variables at startup
 * - Throw errors for missing critical configuration
 * - Use strong typing for configuration values
 */

interface AppConfig {
  // Database
  databaseUrl: string
  
  // Authentication
  jwtSecret: string
  jwtExpiresIn: string
  nextAuthUrl?: string
  
  // API Configuration
  apiUrl: string
  frontendUrl: string
  
  // Environment
  nodeEnv: 'development' | 'production' | 'test'
  isProduction: boolean
  isDevelopment: boolean
  
  // Optional Services
  cloudinary?: {
    cloudName: string
    apiKey: string
    apiSecret: string
  }
  
  payfast?: {
    merchantId: string
    merchantKey: string
    passphrase: string
    sandbox: boolean
  }
  
  email?: {
    host: string
    port: number
    user: string
    password: string
    from: string
  }
}

/**
 * Get required environment variable
 * Throws error if not found (prevents app from running with missing config)
 */
function getRequiredEnv(key: string): string {
  const value = process.env[key]
  
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please check your .env.local file and ensure ${key} is set.\n` +
      `See .env.example for reference.`
    )
  }
  
  return value
}

/**
 * Get optional environment variable with default
 */
function getOptionalEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue
}

/**
 * Validate JWT secret strength
 * Ensures the secret is cryptographically secure
 */
function validateJwtSecret(secret: string): void {
  // Check for insecure default values
  const insecureValues = [
    'your-secret-key',
    'fallback-secret',
    'your-super-secure-production-secret',
    'REPLACE_THIS',
    'secret',
    '12345'
  ]
  
  const lowerSecret = secret.toLowerCase()
  
  for (const insecure of insecureValues) {
    if (lowerSecret.includes(insecure.toLowerCase())) {
      throw new Error(
        `🚨 SECURITY ERROR: JWT secret contains insecure value "${insecure}"!\n\n` +
        `Your NEXTAUTH_SECRET must be a cryptographically secure random string.\n\n` +
        `Generate a secure secret using one of these methods:\n` +
        `  1. Node.js:  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"\n` +
        `  2. OpenSSL:  openssl rand -hex 64\n` +
        `  3. Online:   https://generate-secret.vercel.app/64\n\n` +
        `Then update your .env.local file with the generated secret.`
      )
    }
  }
  
  // Check minimum length (should be at least 32 characters for security)
  if (secret.length < 32) {
    throw new Error(
      `🚨 SECURITY ERROR: JWT secret is too short (${secret.length} characters)!\n\n` +
      `For security, the secret must be at least 32 characters long.\n` +
      `Recommendation: Use a 64-byte (128 character) hex string.\n\n` +
      `Generate a secure secret using:\n` +
      `  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
    )
  }
  
  // Warn if not using recommended length
  if (secret.length < 64) {
    console.warn(
      `⚠️  WARNING: JWT secret is shorter than recommended.\n` +
      `Current length: ${secret.length} characters\n` +
      `Recommended: 128+ characters (64-byte hex string)\n`
    )
  }
}

/**
 * Load and validate application configuration
 * Call this once at application startup
 */
function loadConfig(): AppConfig {
  const nodeEnv = (getOptionalEnv('NODE_ENV', 'development') as 'development' | 'production' | 'test')
  const isProduction = nodeEnv === 'production'
  const isDevelopment = nodeEnv === 'development'
  
  // Get JWT secret
  let jwtSecret: string
  
  if (isProduction) {
    // In production, NEXTAUTH_SECRET is absolutely required
    jwtSecret = getRequiredEnv('NEXTAUTH_SECRET')
    validateJwtSecret(jwtSecret)
  } else {
    // In development, allow optional secret but still validate if provided
    jwtSecret = getOptionalEnv('NEXTAUTH_SECRET', '')
    
    if (!jwtSecret) {
      console.warn(
        `⚠️  WARNING: No NEXTAUTH_SECRET found in .env.local\n` +
        `Using a temporary development secret. This is ONLY acceptable for local development.\n` +
        `Generate a proper secret for production deployment!`
      )
      // Generate a temporary secret for development only
      jwtSecret = 'dev-secret-' + Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15) +
                  Math.random().toString(36).substring(2, 15)
    } else {
      validateJwtSecret(jwtSecret)
    }
  }
  
  // Build configuration object
  const config: AppConfig = {
    // Database
    databaseUrl: getRequiredEnv('DATABASE_URL'),
    
    // Authentication
    jwtSecret,
    jwtExpiresIn: getOptionalEnv('JWT_EXPIRES_IN', '24h'),
    nextAuthUrl: getOptionalEnv('NEXTAUTH_URL'),
    
    // API
    apiUrl: getOptionalEnv('NEXT_PUBLIC_API_URL', 'http://localhost:3001'),
    frontendUrl: getOptionalEnv('NEXT_PUBLIC_FRONTEND_URL', 'http://localhost:3000'),
    
    // Environment
    nodeEnv,
    isProduction,
    isDevelopment,
  }
  
  // Optional: Cloudinary
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    config.cloudinary = {
      cloudName: getRequiredEnv('CLOUDINARY_CLOUD_NAME'),
      apiKey: getRequiredEnv('CLOUDINARY_API_KEY'),
      apiSecret: getRequiredEnv('CLOUDINARY_API_SECRET'),
    }
  }
  
  // Optional: PayFast
  if (process.env.PAYFAST_MERCHANT_ID) {
    config.payfast = {
      merchantId: getRequiredEnv('PAYFAST_MERCHANT_ID'),
      merchantKey: getRequiredEnv('PAYFAST_MERCHANT_KEY'),
      passphrase: getRequiredEnv('PAYFAST_PASSPHRASE'),
      sandbox: getOptionalEnv('PAYFAST_SANDBOX', 'true') === 'true',
    }
  }
  
  // Optional: Email
  if (process.env.SMTP_HOST) {
    config.email = {
      host: getRequiredEnv('SMTP_HOST'),
      port: parseInt(getRequiredEnv('SMTP_PORT'), 10),
      user: getRequiredEnv('SMTP_USER'),
      password: getRequiredEnv('SMTP_PASSWORD'),
      from: getOptionalEnv('SMTP_FROM', 'noreply@zenith-marketplace.co.za'),
    }
  }
  
  return config
}

// Load configuration once at module initialization
let config: AppConfig

try {
  config = loadConfig()
} catch (error) {
  console.error('\n🚨 CONFIGURATION ERROR:\n')
  console.error(error)
  console.error('\nApplication cannot start with invalid configuration.\n')
  
  // In development, don't crash - just warn and use defaults
  if (process.env.NODE_ENV !== 'production') {
    console.warn('\n⚠️  Using minimal configuration for development...\n')
    config = {
      databaseUrl: process.env.DATABASE_URL || '',
      jwtSecret: 'dev-secret-' + Math.random().toString(36).substring(2, 50),
      jwtExpiresIn: '24h',
      apiUrl: 'http://localhost:3001',
      frontendUrl: 'http://localhost:3000',
      nodeEnv: 'development',
      isProduction: false,
      isDevelopment: true,
    }
  } else {
    process.exit(1)
  }
}

// Export the validated configuration
export default config

// Export individual values for convenience
export const {
  databaseUrl,
  jwtSecret,
  jwtExpiresIn,
  apiUrl,
  frontendUrl,
  nodeEnv,
  isProduction,
  isDevelopment,
} = config
