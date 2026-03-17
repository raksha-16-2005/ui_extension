import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ErrorItem } from '@/components/ErrorCard'
import type { CapturedError } from '@/utils/types'
import { playCaptureSound } from '@/utils/sound'

interface ConsolePanelProps {
  selectedError?: ErrorItem | null
  capturedError?: CapturedError | null
  isLoading?: boolean
  onCopy?: (text: string) => void
}

/**
 * ConsolePanel Component - Stack Auth inspired
 * Displays selected error details like Chrome DevTools console
 */
export function ConsolePanel({ selectedError, capturedError, isLoading = false, onCopy }: ConsolePanelProps) {
  const handleCopy = () => {
    const errorLog = buildErrorLog()
    if (onCopy) {
      onCopy(errorLog)
    }
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.15
      }}
      className="h-full flex flex-col rounded-2xl border border-emerald-500/15 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden"
    >
      {/* Console Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-900/80 border-b border-emerald-500/15 px-5 py-4 flex items-center justify-between flex-shrink-0" >
        <div className="flex items-center gap-3">
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-emerald-400 font-bold text-sm"
          >
            ›
          </motion.span>
          <h3 className="text-emerald-300 font-semibold text-sm tracking-wide">CONSOLE</h3>
          {capturedError && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-2 text-xs text-red-400 bg-red-500/10 px-2.5 py-1 rounded border border-red-500/30"
            >
              ERROR
            </motion.span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleCopy}
            disabled={!selectedError && !capturedError}
            className="text-xs h-8 px-3 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 transition-all"
          >
            📋 Copy
          </Button>
          <Button
            size="sm"
            onClick={() => {}}
            className="text-xs h-8 px-3 text-slate-400 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 hover:border-slate-500/50 transition-all"
          >
            🗑️ Clear
          </Button>
        </div>
      </div>

      {/* Console Content */}
      <ScrollArea className="flex-1 bg-slate-950/80">
        <div className="font-mono text-xs text-slate-300">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="h-full flex items-center justify-center p-8 min-h-96"
              >
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="text-4xl inline-block"
                  >
                    ⚙️
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="text-emerald-400 font-semibold text-sm"
                  >
                    Executing error...
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="text-slate-500 text-xs"
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
                className="p-5 space-y-4"
                onAnimationComplete={() => {
                  playCaptureSound()
                }}
              >
                {/* Error Type and Message */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
                  className="flex items-start gap-2"
                >
                  <span className="text-red-400 font-bold text-lg flex-shrink-0 mt-0.5">✕</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-red-300 font-bold">{capturedError.name || 'Error'}</span>
                      <span className="text-slate-400 break-words">{capturedError.message}</span>
                    </div>
                  </div>
                </motion.div>

                {/* File Location */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
                  className="bg-slate-900/80 border-l-2 border-emerald-500/30 pl-3 py-2.5 rounded text-slate-300 text-xs space-y-1"
                >
                  {capturedError.fileName && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-emerald-400 font-semibold">@</span>
                      <span className="text-slate-300">{capturedError.fileName}</span>
                      {capturedError.lineNumber && (
                        <>
                          <span className="text-slate-600">:</span>
                          <span className="text-amber-300 font-semibold">{capturedError.lineNumber}</span>\n                          {capturedError.columnNumber && (
                            <>
                              <span className="text-slate-600">:</span>
                              <span className="text-amber-300 font-semibold">{capturedError.columnNumber}</span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  <div className="text-slate-500">{new Date(capturedError.timestamp).toLocaleString()}</div>
                </motion.div>

                {/* Stack Trace */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
                  className="space-y-2"
                >
                  <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Stack Trace:</div>
                  <div className="bg-slate-900/60 border border-slate-800/50 rounded-lg p-3 max-h-56 overflow-y-auto space-y-1">
                    {getStackTraceLines().map((line, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + idx * 0.04, duration: 0.3, ease: 'easeOut' }}
                        className="text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer break-all hover:bg-slate-800/40 px-2 py-1.5 rounded group"
                      >
                        <span className="text-slate-600 group-hover:text-emerald-600">▹</span> <span className="text-slate-300">{line}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Metadata Footer */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="grid grid-cols-2 gap-3 text-xs text-slate-400 bg-slate-900/40 p-3 rounded border border-slate-800/30"
                >
                  <div>
                    <span className="text-slate-500">Timestamp:</span> <span className="text-emerald-400">{new Date(capturedError.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Error ID:</span> <span className="text-emerald-400 font-mono text-xs">{capturedError.id.substring(0, 8)}</span>
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
                className="p-5 space-y-4"
              >
                {/* Error Type and Message */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
                  className="flex items-start gap-2"
                >
                  <span className="text-amber-400 font-bold text-lg flex-shrink-0 mt-0.5">⚠</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-amber-300 font-bold">{selectedError.type}</span>
                      <span className="text-slate-400 break-words">{selectedError.message}</span>
                    </div>
                  </div>
                </motion.div>

                {/* File Location */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
                  className="bg-slate-900/80 border-l-2 border-cyan-500/30 pl-3 py-2.5 rounded text-slate-300 text-xs"
                >
                  {selectedError.source && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-cyan-400 font-semibold">@</span>
                      <span>{selectedError.source}</span>
                      {selectedError.line && (
                        <>
                          <span className="text-slate-600">:</span>
                          <span className="text-amber-300 font-semibold">{selectedError.line}</span>
                          {selectedError.column && (
                            <>
                              <span className="text-slate-600">:</span>
                              <span className="text-amber-300 font-semibold">{selectedError.column}</span>
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
                  💡 Click the error card above or press Enter to execute and capture details
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center p-8 min-h-96"
              >
                <div className="text-center text-slate-500 space-y-2">
                  <div className="text-3xl opacity-30 mb-2">⚡</div>
                  <p className="text-sm font-medium">No Error Selected</p>
                  <p className="text-xs text-slate-600">Choose an error above to view details</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </motion.div>
  )
}
