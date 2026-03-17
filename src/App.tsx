import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/Header'
import { ErrorSection } from '@/components/ErrorSection'
import { ConsolePanel } from '@/components/ConsolePanel'
import { ErrorHistory } from '@/components/ErrorHistory'
import { motion } from 'framer-motion'
import type { ErrorItem } from '@/components/ErrorCard'
import { JSErrorType } from '@/utils/types'
import { executeErrorTrigger, captureError } from '@/utils/errorHandler'
import { playErrorSound } from '@/utils/sound'
import type { CapturedError } from '@/utils/types'
import './App.css'

// Error trigger file mapping
const ERROR_TRIGGER_MAP: Record<string, string> = {
  'unc-1': 'syntaxError',
  'unc-2': 'typeError',
  'unc-3': 'referenceError',
  'unc-4': 'customError',
  'prom-1': 'promiseChain',
  'prom-2': 'promiseTimeout',
  'prom-3': 'promiseUnhandled',
  'http-1': 'http404',
  'http-2': 'http500',
  'http-3': 'customError',
  'http-4': 'http401',
}

// Mock error data
const mockErrors = {
  uncaught: [
    {
      id: 'unc-1',
      type: JSErrorType.SYNTAX_ERROR,
      message: 'Unexpected token } in JSON at position 156',
      line: 45,
      column: 12,
      source: 'src/components/App.tsx',
    },
    {
      id: 'unc-2',
      type: JSErrorType.TYPE_ERROR,
      message: 'Cannot read property "map" of undefined',
      line: 89,
      column: 24,
      source: 'src/utils/dataHandler.ts',
    },
    {
      id: 'unc-3',
      type: JSErrorType.REFERENCE_ERROR,
      message: 'myVariable is not defined',
      line: 156,
      column: 5,
      source: 'src/pages/dashboard.tsx',
    },
    {
      id: 'unc-4',
      type: JSErrorType.RANGE_ERROR,
      message: 'Maximum call stack size exceeded',
      line: 203,
      column: 18,
      source: 'src/utils/recursion.ts',
    },
  ],
  promise: [
    {
      id: 'prom-1',
      type: JSErrorType.TYPE_ERROR,
      message: 'Promise rejection: TypeError in async operation',
      line: 112,
      column: 8,
      source: 'src/api/fetch.ts',
    },
    {
      id: 'prom-2',
      type: JSErrorType.CUSTOM_ERROR,
      message: 'Network timeout after 30000ms',
      line: 267,
      column: 15,
      source: 'src/services/api.ts',
    },
    {
      id: 'prom-3',
      type: JSErrorType.REFERENCE_ERROR,
      message: 'Unhandled promise rejection: controller is undefined',
      line: 78,
      column: 32,
      source: 'src/hooks/useAsync.ts',
    },
  ],
  http: [
    {
      id: 'http-1',
      type: JSErrorType.CUSTOM_ERROR,
      message: 'HTTP Error 404: Resource not found',
      line: 134,
      column: 20,
      source: 'src/api/endpoints.ts',
    },
    {
      id: 'http-2',
      type: JSErrorType.TYPE_ERROR,
      message: 'HTTP Error 500: Internal Server Error - Response body is not JSON',
      line: 189,
      column: 11,
      source: 'src/middleware/errorHandler.ts',
    },
    {
      id: 'http-3',
      type: JSErrorType.URI_ERROR,
      message: 'Invalid URL: malformed URI in request',
      line: 56,
      column: 7,
      source: 'src/utils/url.ts',
    },
    {
      id: 'http-4',
      type: JSErrorType.CUSTOM_ERROR,
      message: 'HTTP Error 403: Forbidden - Access denied',
      line: 312,
      column: 14,
      source: 'src/api/auth.ts',
    },
  ],
}

function App() {
  const [isDark, setIsDark] = useState(true)
  const [selectedError, setSelectedError] = useState<ErrorItem | null>(null)
  const [capturedError, setCapturedError] = useState<CapturedError | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorHistory, setErrorHistory] = useState<CapturedError[]>([])
  const [enableApiDelay, setEnableApiDelay] = useState(false)

  useEffect(() => {
    // Set dark mode by default
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  // Set up global error handlers
  useEffect(() => {
    // Handle synchronous errors
    const handleWindowError = (
      message: string,
      _source: string,
      _lineno: number,
      _colno: number,
      error: Error
    ) => {
      const capturedErr = captureError(error || new Error(message))
      setCapturedError(capturedErr)
      // Add to error history
      setErrorHistory(prev => [capturedErr, ...prev.slice(0, 49)]) // Keep last 50 errors
      return true // Prevent default error handling
    }

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const capturedErr = captureError(event.reason)
      setCapturedError(capturedErr)
      // Add to error history
      setErrorHistory(prev => [capturedErr, ...prev.slice(0, 49)]) // Keep last 50 errors
      event.preventDefault() // Prevent default rejection handling
    }

    window.addEventListener('error', (event) => {
      handleWindowError(
        event.message,
        event.filename,
        event.lineno,
        event.colno,
        event.error
      )
    })

    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', (event) => {
        handleWindowError(
          event.message,
          event.filename,
          event.lineno,
          event.colno,
          event.error
        )
      })
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  // Handle error card click - dynamically load and execute error trigger
  const handleErrorClick = async (error: ErrorItem) => {
    setSelectedError(error)
    setIsLoading(true)
    setCapturedError(null)
    
    // Play click sound
    playErrorSound()

    const triggerName = ERROR_TRIGGER_MAP[error.id]
    if (!triggerName) {
      setIsLoading(false)
      return
    }

    try {
      await executeErrorTrigger(
        triggerName, 
        (capturedErr) => {
          setCapturedError(capturedErr)
          // Add to error history
          setErrorHistory(prev => [capturedErr, ...prev.slice(0, 49)]) // Keep last 50 errors
        },
        enableApiDelay ? 600 : 0  // 600ms delay if enabled
      )
    } catch (error) {
      // Error already captured by executeErrorTrigger
      console.error('Error execution failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    void navigator.clipboard.writeText(text)
    setTimeout(() => {
      /* Copy feedback timeout */
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-2xl">⚠️</span>
              <div>
                <h1 className="text-xl font-bold">JS Error Lab</h1>
              </div>
            </motion.div>
            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  variant={enableApiDelay ? 'default' : 'outline'}
                  onClick={() => setEnableApiDelay(!enableApiDelay)}
                  className="gap-2 text-xs h-8"
                >
                  {enableApiDelay ? '⏱️' : '⚡'} API Delay
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDark(!isDark)}
                  className="gap-2 h-8"
                >
                  {isDark ? '☀️' : '🌙'} {isDark ? 'Light' : 'Dark'}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-10"
          >
            <Header
              title="JS Error Lab"
              subtitle="Debug and analyze JavaScript errors in real-time. Click on errors to view details."
            />
          </motion.div>

          {/* Error Sections, Console, and History */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          >
            {/* Left Column: Error Categories */}
            <div className="lg:col-span-2 space-y-8">
              {/* Uncaught Errors */}
              <ErrorSection
                title="Uncaught Errors"
                description="Direct errors thrown during execution"
                errors={mockErrors.uncaught}
                onErrorSelect={handleErrorClick}
                selectedErrorId={selectedError?.id}
                icon="💥"
              />

              {/* Promise Errors */}
              <ErrorSection
                title="Promise Rejections"
                description="Unhandled promise rejections and async errors"
                errors={mockErrors.promise}
                onErrorSelect={handleErrorClick}
                selectedErrorId={selectedError?.id}
              icon="⚡"
            />

            {/* HTTP Errors */}
            <ErrorSection
              title="HTTP Errors"
              description="Network requests and API response errors"
              errors={mockErrors.http}
              onErrorSelect={handleErrorClick}
              selectedErrorId={selectedError?.id}
              icon="🌐"
            />
          </div>

          {/* Middle & Right Columns: Console and History */}
          <div className="lg:col-span-3 space-y-8">
            {/* Console Output - Takes full width */}
            <div className="h-full min-h-96">
              <ConsolePanel 
                selectedError={selectedError} 
                capturedError={capturedError}
                isLoading={isLoading}
                onCopy={handleCopy}
              />
            </div>

            {/* Error History */}
            <div className="h-full min-h-72">
              <ErrorHistory
                errors={errorHistory}
                onSelectError={(error) => {
                  setCapturedError(error)
                  setSelectedError(null)
                }}
                onClearHistory={() => setErrorHistory([])}
                selectedErrorId={capturedError?.id}
              />
            </div>
          </div>
        </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer 
        className="border-t border-emerald-500/10 bg-gradient-to-r from-slate-950/80 via-slate-900 to-slate-950/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-xs text-slate-500 uppercase tracking-wider font-medium">
            <p>JS Error Lab © 2024 • Built with React, TypeScript, Tailwind CSS & Framer Motion</p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default App
