import { motion } from 'framer-motion'

interface HeaderProps {
  title?: string
  subtitle?: string
}

/**
 * Header Component - Stack Auth inspired
 * Clean, minimal header with proper spacing and typography
 */
export function Header({
  title = 'JS Error Lab',
  subtitle = 'Debug and analyze JavaScript errors in real-time',
}: HeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12 border-b border-emerald-500/10 pb-8"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full"></div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">{subtitle}</p>
      </div>
    </motion.div>
  )
}
