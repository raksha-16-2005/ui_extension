import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { JSErrorType } from '@/utils/types'
import type { JSErrorType as JSErrorTypeType } from '@/utils/types'

export interface ErrorItem {
  id: string
  type: JSErrorTypeType
  message: string
  line?: number
  column?: number
  source?: string
}

interface ErrorCardProps {
  error: ErrorItem
  onClick: (error: ErrorItem) => void
  isSelected?: boolean
}

/**
 * ErrorCard Component
 * Clickable card showing error details with hover animation
 */
export function ErrorCard({ error, onClick, isSelected = false }: ErrorCardProps) {
  const errorColors: Record<string, { bg: string; border: string; text: string }> = {
    [JSErrorType.SYNTAX_ERROR]: {
      bg: 'bg-red-500/10 dark:bg-red-950/20',
      border: 'border-red-500/30 dark:border-red-800/50',
      text: 'text-red-700 dark:text-red-300',
    },
    [JSErrorType.TYPE_ERROR]: {
      bg: 'bg-orange-500/10 dark:bg-orange-950/20',
      border: 'border-orange-500/30 dark:border-orange-800/50',
      text: 'text-orange-700 dark:text-orange-300',
    },
    [JSErrorType.REFERENCE_ERROR]: {
      bg: 'bg-purple-500/10 dark:bg-purple-950/20',
      border: 'border-purple-500/30 dark:border-purple-800/50',
      text: 'text-purple-700 dark:text-purple-300',
    },
    [JSErrorType.RANGE_ERROR]: {
      bg: 'bg-yellow-500/10 dark:bg-yellow-950/20',
      border: 'border-yellow-500/30 dark:border-yellow-800/50',
      text: 'text-yellow-700 dark:text-yellow-300',
    },
    [JSErrorType.URI_ERROR]: {
      bg: 'bg-blue-500/10 dark:bg-blue-950/20',
      border: 'border-blue-500/30 dark:border-blue-800/50',
      text: 'text-blue-700 dark:text-blue-300',
    },
    [JSErrorType.EVAL_ERROR]: {
      bg: 'bg-pink-500/10 dark:bg-pink-950/20',
      border: 'border-pink-500/30 dark:border-pink-800/50',
      text: 'text-pink-700 dark:text-pink-300',
    },
    [JSErrorType.CUSTOM_ERROR]: {
      bg: 'bg-gray-500/10 dark:bg-gray-800/20',
      border: 'border-gray-500/30 dark:border-gray-700/50',
      text: 'text-gray-700 dark:text-gray-300',
    },
  }

  const colors = errorColors[error.type]

  // Extract HTTP status code from message
  const getHttpStatus = (): string | null => {
    const match = error.message.match(/HTTP (\d{3})/)
    return match ? match[1] : null
  }

  const httpStatus = getHttpStatus()

  // Get glow color based on error type
  const getGlowColor = (type: string): string => {
    if (type.includes('SyntaxError')) return '#ef4444'
    if (type.includes('TypeError')) return '#f97316'
    if (type.includes('ReferenceError')) return '#a855f7'
    if (type.includes('RangeError')) return '#eab308'
    if (type.includes('URIError')) return '#3b82f6'
    if (type.includes('EvalError')) return '#ec4899'
    return '#6b7280'
  }

  const glowColor = getGlowColor(error.type)

  return (
    <motion.div
      whileHover={{ 
        scale: 1.05, 
        y: -6,
        boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 0 30px ${glowColor}40`
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        duration: 0.3,
        ease: 'easeOut'
      }}
      className="relative"
    >
      {/* Glow effect background */}
      <motion.div
        className="absolute inset-0 rounded-md opacity-0 blur-xl pointer-events-none"
        style={{ backgroundColor: glowColor }}
        whileHover={{ opacity: 0.15 }}
        transition={{ duration: 0.3 }}
      />
      
      <Button
        onClick={() => onClick(error)}
        variant="outline"
        className={`w-full h-auto justify-start items-start text-left p-4 ${colors.bg} ${colors.border} border-2 hover:border-opacity-100 transition-all relative z-10 ${
          isSelected ? 'ring-2 ring-accent shadow-lg' : ''
        }`}
      >
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className={`text-sm font-bold ${colors.text}`}>{error.type}</div>
            {httpStatus && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${
                  parseInt(httpStatus) >= 500
                    ? 'bg-red-500/20 text-red-600 border border-red-500/30'
                    : parseInt(httpStatus) >= 400
                    ? 'bg-yellow-500/20 text-yellow-600 border border-yellow-500/30'
                    : 'bg-green-500/20 text-green-600 border border-green-500/30'
                }`}
              >
                {httpStatus}
              </motion.span>
            )}
          </div>
          <p className="text-sm line-clamp-2">{error.message}</p>
          {error.line && (
            <div className="text-xs text-muted-foreground">
              Line {error.line}
              {error.column && `, Column ${error.column}`}
            </div>
          )}
        </div>
      </Button>
    </motion.div>
  )
}
