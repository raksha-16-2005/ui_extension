import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorCard } from '@/components/ErrorCard'
import type { ErrorItem } from '@/components/ErrorCard'

export interface ErrorSectionProps {
  title: string
  description?: string
  errors: ErrorItem[]
  onErrorSelect: (error: ErrorItem) => void
  selectedErrorId?: string
  icon?: React.ReactNode
}

/**
 * ErrorSection Component
 * Container for error category with animated fade-in
 */
export function ErrorSection({
  title,
  description,
  errors,
  onErrorSelect,
  selectedErrorId,
  icon,
}: ErrorSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
        duration: 0.5,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.4,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                {icon && <span>{icon}</span>}
                {title}
              </CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            <span className="text-xs font-semibold bg-accent/10 text-accent px-2 py-1 rounded">
              {errors.length}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {errors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No errors in this category</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
              variants={containerVariants}
            >
              {errors.map((error) => (
                <motion.div key={error.id} variants={itemVariants}>
                  <ErrorCard
                    error={error}
                    onClick={onErrorSelect}
                    isSelected={selectedErrorId === error.id}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
