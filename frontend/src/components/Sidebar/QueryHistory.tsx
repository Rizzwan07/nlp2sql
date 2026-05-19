import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock } from 'lucide-react'
import type { HistoryEntry } from '../../types'

interface QueryHistoryProps {
  history: HistoryEntry[]
  open: boolean
  onClose: () => void
  onSelect: (question: string) => void
}

export function QueryHistory({ history, open, onClose, onSelect }: QueryHistoryProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 z-20 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-12 bottom-0 w-64 bg-white border-r border-neutral-200 z-30 flex flex-col lg:relative lg:top-0"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
              <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                <Clock size={12} />
                History
              </div>
              <button onClick={onClose} className="p-1 rounded hover:bg-neutral-100 text-neutral-400 lg:hidden">
                <X size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              {history.length === 0 ? (
                <p className="text-xs text-neutral-400 px-4 py-8 text-center">
                  No queries yet
                </p>
              ) : (
                [...history].reverse().map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => onSelect(entry.question)}
                    className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 transition-colors group"
                  >
                    <p className="text-sm text-neutral-600 truncate group-hover:text-teal-600 transition-colors">
                      {entry.question}
                    </p>
                    <p className="text-[10px] text-neutral-300 mt-0.5">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </button>
                ))
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
