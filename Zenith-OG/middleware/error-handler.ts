// Backend Error Handling Middleware
// Location: Zenith-OG/middleware/error-handler.ts

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

/**
 * Custom Error Classes
 */
export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, 403)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409)
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429)
  }
}

/**
 * Error Response Interface
 */
interface ErrorResponse {
  success: false
  error: {
    message: string
    code?: string
    statusCode: number
    timestamp: string
    path?: string
    details?: any
  }
  stack?: string
}

/**
 * Logger function for errors
 */
function logError(error: Error, request?: NextRequest) {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    type: 'error',
    message: error.message,
    stack: error.stack,
    url: request?.url,
    method: request?.method,
    userAgent: request?.headers.get('user-agent'),
  }

  // In production, this would go to a logging service (e.g., Winston, Sentry)
  console.error('ERROR:', JSON.stringify(logEntry, null, 2))
}

/**
 * Handle Prisma Database Errors
 */
function handlePrismaError(error: PrismaClientKnownRequestError): ErrorResponse {
  const timestamp = new Date().toISOString()

  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      const field = (error.meta?.target as string[])?.[0] || 'field'
      return {
        success: false,
        error: {
          message: `A record with this ${field} already exists`,
          code: 'DUPLICATE_ENTRY',
          statusCode: 409,
          timestamp,
          details: { field }
        }
      }

    case 'P2025':
      // Record not found
      return {
        success: false,
        error: {
          message: 'The requested record was not found',
          code: 'NOT_FOUND',
          statusCode: 404,
          timestamp
        }
      }

    case 'P2003':
      // Foreign key constraint failed
      return {
        success: false,
        error: {
          message: 'Invalid reference to related record',
          code: 'INVALID_REFERENCE',
          statusCode: 400,
          timestamp
        }
      }

    case 'P2014':
      // Required relation violation
      return {
        success: false,
        error: {
          message: 'Required relationship is missing',
          code: 'MISSING_RELATION',
          statusCode: 400,
          timestamp
        }
      }

    default:
      return {
        success: false,
        error: {
          message: 'Database operation failed',
          code: error.code,
          statusCode: 500,
          timestamp
        }
      }
  }
}

/**
 * Main Error Handler Middleware
 */
export function errorHandler(error: Error, request?: NextRequest): NextResponse {
  logError(error, request)

  const timestamp = new Date().toISOString()
  let errorResponse: ErrorResponse

  // Handle Prisma Errors
  if (error instanceof PrismaClientKnownRequestError) {
    errorResponse = handlePrismaError(error)
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode })
  }

  // Handle Custom App Errors
  if (error instanceof AppError) {
    errorResponse = {
      success: false,
      error: {
        message: error.message,
        statusCode: error.statusCode,
        timestamp,
        path: request?.url
      }
    }

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = error.stack
    }

    return NextResponse.json(errorResponse, { status: error.statusCode })
  }

  // Handle JWT Errors
  if (error.name === 'JsonWebTokenError') {
    errorResponse = {
      success: false,
      error: {
        message: 'Invalid authentication token',
        code: 'INVALID_TOKEN',
        statusCode: 401,
        timestamp
      }
    }
    return NextResponse.json(errorResponse, { status: 401 })
  }

  if (error.name === 'TokenExpiredError') {
    errorResponse = {
      success: false,
      error: {
        message: 'Authentication token has expired',
        code: 'TOKEN_EXPIRED',
        statusCode: 401,
        timestamp
      }
    }
    return NextResponse.json(errorResponse, { status: 401 })
  }

  // Handle Validation Errors (e.g., from Zod)
  if (error.name === 'ZodError') {
    errorResponse = {
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        timestamp,
        details: (error as any).errors
      }
    }
    return NextResponse.json(errorResponse, { status: 400 })
  }

  // Default Internal Server Error
  errorResponse = {
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : error.message,
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
      timestamp
    }
  }

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack
  }

  return NextResponse.json(errorResponse, { status: 500 })
}

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors and pass them to error handler
 */
export function asyncHandler(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    try {
      return await handler(req, context)
    } catch (error) {
      return errorHandler(error as Error, req)
    }
  }
}

/**
 * Rate Limit Store (In-memory - use Redis in production)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Rate Limiting Middleware
 */
export function rateLimit(options: {
  windowMs: number
  maxRequests: number
}) {
  return (req: NextRequest) => {
    const identifier = req.headers.get('x-forwarded-for') || 
                       req.headers.get('x-real-ip') || 
                       'unknown'
    
    const now = Date.now()
    const userLimit = rateLimitStore.get(identifier)

    if (userLimit && userLimit.resetTime > now) {
      if (userLimit.count >= options.maxRequests) {
        throw new RateLimitError(
          `Too many requests. Please try again in ${Math.ceil((userLimit.resetTime - now) / 1000)} seconds`
        )
      }
      userLimit.count++
    } else {
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + options.windowMs
      })
    }

    // Cleanup old entries periodically
    if (rateLimitStore.size > 10000) {
      for (const [key, value] of rateLimitStore.entries()) {
        if (value.resetTime < now) {
          rateLimitStore.delete(key)
        }
      }
    }
  }
}

/**
 * Request Validation Middleware
 */
export function validateRequest(schema: any) {
  return async (req: NextRequest) => {
    try {
      const body = await req.json()
      await schema.parseAsync(body)
    } catch (error) {
      throw new ValidationError('Invalid request data')
    }
  }
}

/**
 * Example Usage in API Route:
 * 
 * import { asyncHandler, NotFoundError, ValidationError } from '@/middleware/error-handler'
 * 
 * export const GET = asyncHandler(async (request: NextRequest) => {
 *   const { searchParams } = new URL(request.url)
 *   const id = searchParams.get('id')
 *   
 *   if (!id) {
 *     throw new ValidationError('Product ID is required')
 *   }
 *   
 *   const product = await prisma.product.findUnique({
 *     where: { id }
 *   })
 *   
 *   if (!product) {
 *     throw new NotFoundError('Product not found')
 *   }
 *   
 *   return NextResponse.json({ success: true, product })
 * })
 */
