/**
 * Error utility functions
 */

import type { CapturedError, JSErrorType } from './types'
import { JSErrorType as ErrorTypes } from './types'

export interface ErrorInfo {
  message: string
  stack?: string
  timestamp: Date
  severity: 'error' | 'warning' | 'info'
}

/**
 * Format error for display
 */
export function formatError(error: unknown): ErrorInfo {
  const timestamp = new Date()

  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      timestamp,
      severity: 'error',
    }
  }

  return {
    message: String(error),
    timestamp,
    severity: 'error',
  }
}

/**
 * Parse error stack trace
 */
export function parseStackTrace(stack?: string): string[] {
  if (!stack) return []
  return stack.split('\n').filter(line => line.trim())
}

/**
 * Log error for debugging
 */
export function logError(error: unknown, context?: string): void {
  const formatted = formatError(error)
  console.error(`[${context || 'Error'}] ${formatted.message}`, {
    stack: formatted.stack,
    timestamp: formatted.timestamp,
  })
}

/**
 * Extract error type from error name/message
 */
function getErrorType(errorName: string): JSErrorType {
  if (errorName.includes('TypeError')) return ErrorTypes.TYPE_ERROR
  if (errorName.includes('ReferenceError')) return ErrorTypes.REFERENCE_ERROR
  if (errorName.includes('SyntaxError')) return ErrorTypes.SYNTAX_ERROR
  if (errorName.includes('RangeError')) return ErrorTypes.RANGE_ERROR
  if (errorName.includes('URIError')) return ErrorTypes.URI_ERROR
  if (errorName.includes('EvalError')) return ErrorTypes.EVAL_ERROR
  return ErrorTypes.CUSTOM_ERROR
}

/**
 * Capture detailed error information
 */
export function captureError(error: unknown): CapturedError {
  const timestamp = Date.now()
  const id = `error-${timestamp}-${Math.random().toString(36).substr(2, 9)}`

  if (error instanceof Error) {
    const errorName = error.name || 'Error'
    const message = error.message || String(error)
    const stack = error.stack || ''
    
    // Extract file and line info from stack trace
    const stackLines = stack.split('\n')
    let fileName: string | undefined
    let lineNumber: number | undefined
    let columnNumber: number | undefined

    for (const line of stackLines) {
      const match = line.match(/\s*at\s+(?:\w+\s+)?\(?(.+?):(\d+):(\d+)\)?/);
      if (match) {
        fileName = match[1]
        lineNumber = parseInt(match[2], 10)
        columnNumber = parseInt(match[3], 10)
        break
      }
    }

    return {
      id,
      name: errorName,
      message,
      type: getErrorType(errorName),
      stack,
      fileName,
      lineNumber,
      columnNumber,
      timestamp,
    }
  }

  // Handle non-Error throws
  const message = String(error)
  return {
    id,
    name: 'Error',
    message,
    type: ErrorTypes.CUSTOM_ERROR,
    timestamp,
  }
}

/**
 * Dynamically load and execute an error trigger
 */
export async function executeErrorTrigger(
  triggerName: string,
  onError: (error: CapturedError) => void,
  apiDelay: number = 0
): Promise<void> {
  try {
    // Simulate API delay (optional)
    if (apiDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, apiDelay))
    }

    // Dynamically import the error module
    const module = await import(`../errors/${triggerName}.js`)
    
    // Execute the runError function
    const result = module.runError()

    // If it returns a promise, handle it
    if (result instanceof Promise) {
      try {
        await result
      } catch (error) {
        onError(captureError(error))
      }
    }
  } catch (error) {
    // Catch synchronous errors
    onError(captureError(error))
  }
}
