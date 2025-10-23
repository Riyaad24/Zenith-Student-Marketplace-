// Validation utilities for Zenith Student Marketplace

/**
 * List of recognized South African tertiary institutions and their email domains
 */
const SA_TERTIARY_DOMAINS = [
  // Major Universities
  'uct.ac.za',           // University of Cape Town
  'wits.ac.za',          // University of the Witwatersrand
  'up.ac.za',            // University of Pretoria
  'sun.ac.za',           // Stellenbosch University
  'ukzn.ac.za',          // University of KwaZulu-Natal
  'uwc.ac.za',           // University of the Western Cape
  'ru.ac.za',            // Rhodes University
  'nwu.ac.za',           // North-West University
  'ufs.ac.za',           // University of the Free State
  'uj.ac.za',            // University of Johannesburg
  'tut.ac.za',           // Tshwane University of Technology
  'dut.ac.za',           // Durban University of Technology
  'cput.ac.za',          // Cape Peninsula University of Technology
  'vut.ac.za',           // Vaal University of Technology
  'cut.ac.za',           // Central University of Technology
  'mut.ac.za',           // Mangosuthu University of Technology
  'univen.ac.za',        // University of Venda
  'ul.ac.za',            // University of Limpopo
  'ufh.ac.za',           // University of Fort Hare
  'unizulu.ac.za',       // University of Zululand
  'smu.ac.za',           // Sefako Makgatho Health Sciences University
  'unisa.ac.za',         // University of South Africa (UNISA)
  
  // Colleges and Private Institutions
  'richfield.ac.za',     // Richfield Graduate Institute
  'varsitycollege.ac.za', // Varsity College
  'rosebank.ac.za',      // Rosebank College
  'boston.ac.za',        // Boston City Campus
  'iie.ac.za',           // Independent Institute of Education
  'inscape.ac.za',       // Inscape Design College
  'afda.ac.za',          // AFDA Film School
  'ict.ac.za',           // ICT College
  'belgiumcampus.ac.za', // Belgium Campus
  'milpark.ac.za',       // Milpark Education
  'regent.ac.za',        // Regent Business School
  'damelin.ac.za',       // Damelin Correspondence College
  'univen.ac.za',        // University of Venda
  'cti.ac.za',           // CTI Education Group
  
  // Medical and Specialized Institutions
  'wsu.ac.za',           // Walter Sisulu University
  'spu.ac.za',           // Sol Plaatje University
  'mpu.ac.za',           // Mpumalanga University
  
  // Technical and Vocational Education and Training (TVET) Colleges
  'tvetcolleges.ac.za',  // Generic TVET domain
  'false-bay.ac.za',     // False Bay TVET College
  'northlink.ac.za',     // Northlink College
  'swgc.ac.za',          // South West Gauteng College
  'ekurhuleni.tvet.ac.za', // Ekurhuleni East TVET College
]

/**
 * Regular expression to match student email format
 * Should contain only student numbers (digits) before the @ symbol
 * e.g., 123456789@domain.ac.za or 987654321@my.domain.ac.za
 */
const STUDENT_EMAIL_REGEX = /^[0-9]+@(my\.)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.ac\.za$/

/**
 * South African phone number validation
 * Must start with +27 followed by 9 digits
 * Valid formats: +27XXXXXXXXX, +27 XX XXX XXXX, +27-XX-XXX-XXXX
 */
const SA_PHONE_REGEX = /^\+27[0-9]{9}$|^\+27\s[0-9]{2}\s[0-9]{3}\s[0-9]{4}$|^\+27-[0-9]{2}-[0-9]{3}-[0-9]{4}$/

/**
 * Validates if an email address is from a recognized South African tertiary institution
 * and follows the student number format
 */
export function validateStudentEmail(email: string): {
  isValid: boolean
  error?: string
  institution?: string
} {
  if (!email) {
    return { isValid: false, error: 'Email is required' }
  }

  // Convert to lowercase for comparison
  const lowerEmail = email.toLowerCase().trim()

  // Check if it matches the student email pattern
  if (!STUDENT_EMAIL_REGEX.test(lowerEmail)) {
    return {
      isValid: false,
      error: 'Email must contain only your student number (digits) and be from a South African tertiary institution (e.g., 123456789@uct.ac.za)'
    }
  }

  // Extract domain from email
  const domain = lowerEmail.split('@')[1]
  
  // Remove 'my.' prefix if present for domain matching
  const baseDomain = domain.replace(/^my\./, '')

  // Check if domain is from a recognized SA tertiary institution
  const institution = SA_TERTIARY_DOMAINS.find(institutionDomain => 
    baseDomain === institutionDomain
  )

  if (!institution) {
    return {
      isValid: false,
      error: `Email domain "${domain}" is not from a recognized South African tertiary institution. Please use your official student email address.`
    }
  }

  return {
    isValid: true,
    institution: institution
  }
}

/**
 * Validates South African phone number format
 */
export function validateSAPhoneNumber(phone: string): {
  isValid: boolean
  error?: string
  formatted?: string
} {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' }
  }

  const cleanPhone = phone.trim()

  // Check if it matches SA phone number pattern
  if (!SA_PHONE_REGEX.test(cleanPhone)) {
    return {
      isValid: false,
      error: 'Phone number must be a valid South African number starting with +27 (e.g., +27123456789)'
    }
  }

  // Return formatted phone number (standardized format)
  const digitsOnly = cleanPhone.replace(/[^\d]/g, '').substring(2) // Remove +27 and keep digits
  const formatted = `+27${digitsOnly}`

  return {
    isValid: true,
    formatted: formatted
  }
}

/**
 * Get institution name from email domain
 */
export function getInstitutionName(email: string): string {
  const domain = email.toLowerCase().split('@')[1]?.replace(/^my\./, '')
  
  const institutionMap: { [key: string]: string } = {
    'uct.ac.za': 'University of Cape Town',
    'wits.ac.za': 'University of the Witwatersrand',
    'up.ac.za': 'University of Pretoria',
    'sun.ac.za': 'Stellenbosch University',
    'ukzn.ac.za': 'University of KwaZulu-Natal',
    'uwc.ac.za': 'University of the Western Cape',
    'ru.ac.za': 'Rhodes University',
    'nwu.ac.za': 'North-West University',
    'ufs.ac.za': 'University of the Free State',
    'uj.ac.za': 'University of Johannesburg',
    'tut.ac.za': 'Tshwane University of Technology',
    'dut.ac.za': 'Durban University of Technology',
    'cput.ac.za': 'Cape Peninsula University of Technology',
    'vut.ac.za': 'Vaal University of Technology',
    'cut.ac.za': 'Central University of Technology',
    'mut.ac.za': 'Mangosuthu University of Technology',
    'univen.ac.za': 'University of Venda',
    'ul.ac.za': 'University of Limpopo',
    'ufh.ac.za': 'University of Fort Hare',
    'unizulu.ac.za': 'University of Zululand',
    'smu.ac.za': 'Sefako Makgatho Health Sciences University',
    'unisa.ac.za': 'University of South Africa',
    'richfield.ac.za': 'Richfield Graduate Institute',
    'varsitycollege.ac.za': 'Varsity College',
    'rosebank.ac.za': 'Rosebank College',
    'boston.ac.za': 'Boston City Campus',
    'iie.ac.za': 'Independent Institute of Education',
    'inscape.ac.za': 'Inscape Design College',
    'afda.ac.za': 'AFDA Film School',
    'ict.ac.za': 'ICT College',
    'belgiumcampus.ac.za': 'Belgium Campus',
    'milpark.ac.za': 'Milpark Education',
    'regent.ac.za': 'Regent Business School',
    'damelin.ac.za': 'Damelin Correspondence College',
    'cti.ac.za': 'CTI Education Group',
  }
  
  return institutionMap[domain] || domain
}

/**
 * Validates file upload for verification documents
 */
export function validateVerificationFile(file: File, type: 'profile' | 'studentCard' | 'idDocument'): {
  isValid: boolean
  error?: string
} {
  // File size limits (in MB)
  const maxSizes = {
    profile: 5,      // 5MB for profile pictures
    studentCard: 10, // 10MB for student card scans
    idDocument: 10   // 10MB for ID document scans
  }

  // Allowed file types
  const allowedTypes = {
    profile: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    studentCard: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'],
    idDocument: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
  }

  if (!file) {
    return { isValid: false, error: 'File is required' }
  }

  // Check file size
  const maxSizeBytes = maxSizes[type] * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSizes[type]}MB`
    }
  }

  // Check file type
  if (!allowedTypes[type].includes(file.type)) {
    const typesList = type === 'profile' 
      ? 'JPEG, PNG, or WebP' 
      : 'JPEG, PNG, WebP, or PDF'
    return {
      isValid: false,
      error: `File must be ${typesList} format`
    }
  }

  return { isValid: true }
}