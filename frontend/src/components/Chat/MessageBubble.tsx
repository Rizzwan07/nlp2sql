import { motion } from 'framer-motion'
import { BarChart3, AlertCircle, Code2 } from 'lucide-react'
import type { Message } from '../../types'
import { SqlBlock } from '../Results/SqlBlock'
import { DataTable } from '../Results/DataTable'
import { ChartView } from '../Results/ChartView'

interface MessageBubbleProps {
  message: Message
  onToggleChart: () => void
}

export function MessageBubble({ message, onToggleChart }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const hasData = !isUser && message.columns && message.rows && message.rows.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className="max-w-[80%]">
        <div
          className={`rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
            isUser
              ? 'bg-neutral-100 text-neutral-800'
              : message.error
                ? 'bg-red-50 text-red-700 border border-red-100'
                : 'bg-white border border-neutral-200 text-neutral-700 shadow-sm'
          }`}
        >
          {message.error && <AlertCircle size={14} className="inline mr-1.5 -mt-0.5 text-red-400" />}
          <span className="whitespace-pre-wrap">{message.content}</span>
        </div>

        {!isUser && !message.error && (message.sql || hasData) && (
          <div className="mt-1.5 flex items-center gap-1.5 pl-1">
            {message.sql && <SqlBlock sql={message.sql} />}
            {hasData && (
              <button
                onClick={onToggleChart}
                className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${
                  message.showChart
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-neutral-400 hover:text-teal-600 hover:bg-teal-50'
                }`}
              >
                <BarChart3 size={12} />
                {message.showChart ? 'Hide chart' : 'Chart'}
              </button>
            )}
          </div>
        )}

        {hasData && message.showChart && (
          <ChartView columns={message.columns!} rows={message.rows!} />
        )}

        {hasData && message.rows!.length > 1 && (
          <DataTable columns={message.columns!} rows={message.rows!} />
        )}
      </div>
    </motion.div>
  )
}
