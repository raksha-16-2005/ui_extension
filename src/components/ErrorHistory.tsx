import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { CapturedError } from '@/utils/types'

interface ErrorHistoryProps {
  errors: CapturedError[]
  onSelectError: (error: CapturedError) => void
  onClearHistory: () => void
  selectedErrorId?: string
}

/**
 * ErrorHistory Component
 * Displays list of previously captured errors
 */
export function ErrorHistory({
  errors,
  onSelectError,
  onClearHistory,
  selectedErrorId,
}: ErrorHistoryProps) {
  // Get HTTP status code if available
  const getStatusCode = (error: CapturedError): string | null => {
    const match = error.message.match(/HTTP (\d{3})/)
    return match ? match[1] : null
  }

  // Get badge color based on status code
  const getStatusBadgeColor = (statusCode: string): string => {
    const code = parseInt(statusCode, 10)
    if (code >= 400 && code < 500) return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30'
    if (code >= 500) return 'bg-red-500/20 text-red-600 border-red-500/30'
    return 'bg-green-500/20 text-green-600 border-green-500/30'
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="h-full flex flex-col"
    >
      <Card className="h-full flex flex-col border-border/50">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Error History</CardTitle>
              <CardDescription>Previously captured errors</CardDescription>
            </div>
            {errors.length > 0 && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onClearHistory}
                  className="text-xs h-7"
                >
                  Clear
                </Button>
              </motion.div>
            )}
          </div>
        </CardHeader>

        <ScrollArea className="flex-1">
          <CardContent className="p-0">
            {errors.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-32 text-muted-foreground"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">📭</div>
                  <p className="text-sm">No error history yet</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2 p-4"
              >
                <AnimatePresence>
                  {errors.map((error) => {
                    const statusCode = getStatusCode(error)
                    const isSelected = selectedErrorId === error.id

                    return (
                      <motion.div
                        key={error.id}
                        variants={itemVariants}
                        exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onSelectError(error)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            isSelected
                              ? 'bg-accent/10 border-accent/50 shadow-md'
                              : 'bg-slate-900/30 border-slate-700/30 hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="flex items-start gap-2 justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-mono text-slate-400 truncate">
                                {error.name}
                              </div>
                              <p className="text-xs text-slate-300 line-clamp-1 mt-1">
                                {error.message}
                              </p>
                              <div className="text-xs text-slate-500 mt-1">
                                {new Date(error.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                            {statusCode && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`text-xs font-bold px-2 py-1 rounded border shrink-0 ${getStatusBadgeColor(
                                  statusCode
                                )}`}
                              >
                                {statusCode}
                              </motion.span>
                            )}
                          </div>
                        </motion.button>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>
    </motion.div>
  )
}
