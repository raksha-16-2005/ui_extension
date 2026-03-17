import { motion } from 'framer-motion'
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
 * ErrorCard Component - Stack Auth inspired
 * Clean tile with icons, hover effects, and green accent styling
 */
export function ErrorCard({ error, onClick, isSelected = false }: ErrorCardProps) {
  // Error icons and styling
  const errorConfig: Record<string, { icon: string; color: string; glow: string }> = {
    [JSErrorType.SYNTAX_ERROR]: {
      icon: '⚡',
      color: 'text-red-400',
      glow: 'from-red-500/20 to-red-600/10',
    },
    [JSErrorType.TYPE_ERROR]: {
      icon: '🔧',
      color: 'text-orange-400',
      glow: 'from-orange-500/20 to-orange-600/10',
    },
    [JSErrorType.REFERENCE_ERROR]: {
      icon: '❓',
      color: 'text-purple-400',
      glow: 'from-purple-500/20 to-purple-600/10',
    },
    [JSErrorType.RANGE_ERROR]: {
      icon: '📊',
      color: 'text-yellow-400',
      glow: 'from-yellow-500/20 to-yellow-600/10',
    },
    [JSErrorType.URI_ERROR]: {
      icon: '🔗',
      color: 'text-blue-400',
      glow: 'from-blue-500/20 to-blue-600/10',
    },
    [JSErrorType.EVAL_ERROR]: {
      icon: '⚙️',
      color: 'text-pink-400',
      glow: 'from-pink-500/20 to-pink-600/10',
    },
    [JSErrorType.CUSTOM_ERROR]: {
      icon: '⚠️',
      color: 'text-slate-400',
      glow: 'from-slate-500/20 to-slate-600/10',
    },
  }

  const config = errorConfig[error.type]

  // Extract HTTP status code from message
  const getHttpStatus = (): string | null => {
    const match = error.message.match(/HTTP (\d{3})/)
    return match ? match[1] : null
  }

  const httpStatus = getHttpStatus()

  // Get badge color for HTTP status
  const getStatusColor = (code: string): string => {
    const codeNum = parseInt(code, 10)
    if (codeNum >= 500) return 'bg-red-500/20 text-red-300 border-red-500/30'
    if (codeNum >= 400) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  }

  return (
    <motion.button
      onClick={() => onClick(error)}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        w-full text-left p-4 rounded-2xl transition-all duration-300 ease-in-out
        border bg-gradient-to-br
        hover:shadow-green-glow
        relative group overflow-hidden
        ${isSelected
          ? `${config.glow} border-emerald-500/50 shadow-green-glow-lg`
          : 'border-emerald-500/15 from-slate-900/50 to-slate-900 hover:border-emerald-500/30'
        }
      `}
    >
      <div className="space-y-2 relative z-10">
        {/* Icon and Title */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0">{config.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm truncate">{error.type.replace('Error', '')}</p>
            </div>
          </div>
          {httpStatus && (
            <span className={`px-2.5 py-1 text-xs font-medium rounded-lg border whitespace-nowrap flex-shrink-0 ${getStatusColor(httpStatus)}`}>
              {httpStatus}
            </span>
          )}
        </div>

        {/* Message */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{error.message}</p>

        {/* Metadata */}
        {(error.source || error.line) && (
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
            {error.source && <span className="truncate">{error.source}</span>}
            {error.line && <span>:{error.line}</span>}
          </div>
        )}
      </div>

      {/* Subtle border animation on hover */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none group-hover:border-emerald-500/20 border" />
    </motion.button>
  )
}
