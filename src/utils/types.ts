/**
 * JavaScript Error Types
 */

const JS_ERROR_TYPES = {
  SYNTAX_ERROR: 'SyntaxError',
  TYPE_ERROR: 'TypeError',
  REFERENCE_ERROR: 'ReferenceError',
  RANGE_ERROR: 'RangeError',
  URI_ERROR: 'URIError',
  EVAL_ERROR: 'EvalError',
  CUSTOM_ERROR: 'CustomError',
} as const

export type JSErrorType = (typeof JS_ERROR_TYPES)[keyof typeof JS_ERROR_TYPES]

export const JSErrorType = JS_ERROR_TYPES

/**
 * Error trigger file mapping
 */
export const ERROR_TRIGGERS = {
  typeError: 'typeError',
  referenceError: 'referenceError',
  syntaxError: 'syntaxError',
  customError: 'customError',
  promiseUnhandled: 'promiseUnhandled',
  promiseChain: 'promiseChain',
  promiseTimeout: 'promiseTimeout',
  http400: 'http400',
  http401: 'http401',
  http404: 'http404',
  http500: 'http500',
} as const

export type ErrorTrigger = (typeof ERROR_TRIGGERS)[keyof typeof ERROR_TRIGGERS]

export interface JSError {
  type: JSErrorType
  message: string
  line?: number
  column?: number
  source?: string
  stack?: string
}

/**
 * Captured error with full details
 */
export interface CapturedError {
  id: string
  name: string
  message: string
  type: JSErrorType
  stack?: string
  fileName?: string
  lineNumber?: number
  columnNumber?: number
  timestamp: number
  source?: string
}

export interface ErrorContext {
  url: string
  userAgent: string
  timestamp: string
}
