import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ErrorItem } from '@/components/ErrorCard'
import type { CapturedError } from '@/utils/types'
import { useState } from 'react'
import { playCaptureSound } from '@/utils/sound'

interface ConsolePanelProps {
  selectedError?: ErrorItem | null
  capturedError?: CapturedError | null
  isLoading?: boolean
  onCopy?: (text: string) => void
}

/**
 * ConsolePanel Component
 * Displays selected error details like Chrome DevTools console
 */
export function ConsolePanel({ selectedError, capturedError, isLoading = false, onCopy }: ConsolePanelProps) {
  const [consoleLogs, setConsoleLogs] = useState<string[]>([])

  const handleCopy = () => {
    const errorLog = buildErrorLog()
    if (onCopy) {
      onCopy(errorLog)
    }
  }

  const handleClearConsole = () => {
    setConsoleLogs([])
  }

  // Build complete error log as string
  const buildErrorLog = (): string => {
    if (capturedError) {
      return `${capturedError.name}: ${capturedError.message}
File: ${capturedError.fileName || 'unknown'}
Line: ${capturedError.lineNumber || 'unknown'}
Column: ${capturedError.columnNumber || 'unknown'}
Time: ${new Date(capturedError.timestamp).toLocaleString()}

Stack Trace:
${capturedError.stack || 'No stack trace available'}`
    } else if (selectedError) {
      return `${selectedError.type}: ${selectedError.message}
File: ${selectedError.source || 'unknown'}
Line: ${selectedError.line || 'unknown'}
Column: ${selectedError.column || 'unknown'}`
    }
    return ''
  }

  // Parse stack trace from captured error
  const getStackTraceLines = (): string[] => {
    if (!capturedError || !capturedError.stack) {
      return [
        'at Object.<anonymous> (app.tsx:15:24)',
        'at processRequest (/src/utils/errorHandler.ts:42:11)',
        'at async execute (index.ts:78:5)',
        'at Module.load (internal/modules/cjs/loader.js:936:11)',
        'at Function.Module._load (internal/modules/cjs/loader.js:862:11)',
      ]
    }

    // Parse stack trace lines
    return capturedError.stack
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
  }

  // Get color class for error type
  const getErrorTypeColor = (errorType: string): string => {
    if (errorType.includes('TypeError')) return 'text-red-400'
    if (errorType.includes('ReferenceError')) return 'text-yellow-400'
    if (errorType.includes('SyntaxError')) return 'text-pink-400'
    if (errorType.includes('RangeError')) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.15,
        ease: 'easeOut'
      }}
      className="h-full flex flex-col"
    >
      {/* DevTools Header */}
      <div className="bg-slate-900 border-b border-slate-700/50 px-4 py-3 flex items-center justify-between" style={{ backgroundImage: 'linear-gradient(to bottom, rgb(15, 23, 42), rgb(3, 7, 18))' }}>
        <div className="flex items-center gap-2">
          <span className="text-green-400 font-bold text-sm">❯</span>
          <h3 className="text-green-400 font-semibold text-sm">Console</h3>
          {capturedError && (
            <span className="ml-3 text-xs text-red-400 bg-red-950/30 px-2 py-1 rounded border border-red-800/50">
              Error
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            disabled={!selectedError && !capturedError}
            className="text-xs h-7 text-green-400 hover:bg-slate-800 hover:text-green-300 border border-slate-700/50"
          >
            📋 Copy
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClearConsole}
            className="text-xs h-7 text-green-400 hover:bg-slate-800 hover:text-green-300 border border-slate-700/50"
          >
            🗑️ Clear
          </Button>
        </div>
      </div>

      {/* Console Content */}
      <ScrollArea className="flex-1 bg-slate-950">
        <div className="font-mono text-xs text-slate-300">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="h-full flex items-center justify-center p-8"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="text-4xl mb-4 inline-block"
                  >
                    ⚙️
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="text-green-400 font-semibold"
                  >
                    Executing error...
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="text-slate-500 text-xs mt-2"
                  >
                    Capturing error details
                  </motion.div>
                </div>
              </motion.div>
            ) : capturedError ? (
              <motion.div
                key={capturedError.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ 
                  duration: 0.4,
                  ease: 'easeOut'
                }}
                className="p-4 space-y-3"
                onAnimationComplete={() => {
                  // Play sound when error is fully rendered
                  playCaptureSound()
                }}
              >
                {/* Error Type and Message */}
                <div className="space-y-1">
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
                    className="flex items-start gap-2"
                  >
                    <span className="text-red-400 font-bold">❌</span>
                    <div>
                      <span className={`${getErrorTypeColor(capturedError.name)} font-bold`}>
                        {capturedError.name || 'Error'}
                      </span>
                      <span className="text-slate-400 ml-2">{capturedError.message}</span>
                    </div>
                  </motion.div>
                </div>

                {/* File Location with Syntax Highlighting */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
                  className="bg-slate-900/50 border-l-2 border-green-500/30 pl-3 py-2 rounded text-slate-400"
                >
                  {capturedError.fileName && (
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">@</span>
                      <span>{capturedError.fileName}</span>
                      {capturedError.lineNumber && (
                        <>
                          <span className="text-slate-500">:</span>
                          <span className="text-yellow-400">{capturedError.lineNumber}</span>
                          {capturedError.columnNumber && (
                            <>
                              <span className="text-slate-500">:</span>
                              <span className="text-yellow-400">{capturedError.columnNumber}</span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </motion.div>

                {/* Stack Trace - Scrollable */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
                  className="space-y-2"
                >
                  <div className="text-slate-500 text-xs font-semibold">Stack Trace:</div>
                  <div className="bg-slate-900/30 border border-slate-800/50 rounded-lg p-3 max-h-48 overflow-y-auto">
                    {getStackTraceLines().map((line, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + idx * 0.04, duration: 0.3, ease: 'easeOut' }}
                        className="text-slate-400 hover:text-green-300 transition-colors cursor-pointer break-all hover:bg-slate-800/40 px-2 py-1 rounded"
                      >
                        <span className="text-slate-600">▸</span> {line}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Metadata */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
                  className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-900/20 p-2 rounded border border-slate-800/30"
                >
                  <div>
                    <span className="text-slate-500">Time:</span>{' '}
                    <span className="text-green-400">
                      {new Date(capturedError.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">ID:</span>{' '}
                    <span className="text-green-400 font-mono">{capturedError.id.substring(0, 12)}</span>
                  </div>
                </motion.div>
              </motion.div>
            ) : selectedError ? (
              <motion.div
                key={selectedError.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ 
                  duration: 0.4,
                  ease: 'easeOut'
                }}
                className="p-4 space-y-3"
              >
                {/* Error Type and Message */}
                <div className="space-y-1">
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
                    className="flex items-start gap-2"
                  >
                    <span className="text-yellow-400 font-bold">⚠️</span>
                    <div>
                      <span className={`${getErrorTypeColor(selectedError.type)} font-bold`}>
                        {selectedError.type}
                      </span>
                      <span className="text-slate-400 ml-2">{selectedError.message}</span>
                    </div>
                  </motion.div>
                </div>

                {/* File Location */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
                  className="bg-slate-900/50 border-l-2 border-blue-400/30 pl-3 py-2 rounded text-slate-400"
                >
                  {selectedError.source && (
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">@</span>
                      <span>{selectedError.source}</span>
                      {selectedError.line && (
                        <>
                          <span className="text-slate-500">:</span>
                          <span className="text-yellow-400">{selectedError.line}</span>
                          {selectedError.column && (
                            <>
                              <span className="text-slate-500">:</span>
                              <span className="text-yellow-400">{selectedError.column}</span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </motion.div>

                {/* Action Message */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
                  className="text-slate-500 text-xs italic border-t border-slate-800/50 pt-3"
                >
                  💡 Click "Copy" or press Enter to execute and capture actual error details
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center p-8"
              >
                <div className="text-center text-slate-500">
                  <div className="text-4xl mb-3 opacity-50">›</div>
                  <p className="text-sm">No error selected</p>
                  <p className="text-xs text-slate-600 mt-1">Choose an error to view details</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </motion.div>
  )
}
