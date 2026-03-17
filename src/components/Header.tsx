import { motion } from 'framer-motion'

interface HeaderProps {
  title?: string
  subtitle?: string
}

/**
 * Header Component
 * Displays the main title and subtitle with fade-in animation
 */
export function Header({
  title = 'JS Error Lab',
  subtitle = 'Debug and analyze JavaScript errors in real-time',
}: HeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mb-8"
    >
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <p className="text-lg text-muted-foreground">{subtitle}</p>
      </div>
    </motion.div>
  )
}
