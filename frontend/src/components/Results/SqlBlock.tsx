import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2 } from 'lucide-react'

interface SqlBlockProps {
  sql: string
}

export function SqlBlock({ sql }: SqlBlockProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${
          expanded
            ? 'bg-blue-50 text-blue-600'
            : 'text-neutral-400 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >
        <Code2 size={12} />
        SQL
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <pre className="mt-2 bg-neutral-50 text-neutral-600 border border-neutral-200 text-xs font-mono rounded-xl p-3 whitespace-pre-wrap overflow-x-auto">
              {sql}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
