import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Message } from '../../types'
import { MessageBubble } from './MessageBubble'
import { WelcomeScreen } from './WelcomeScreen'

interface ChatAreaProps {
  messages: Message[]
  loading: boolean
  onSend: (question: string) => void
  onToggleChart: (msgId: string) => void
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-start"
    >
      <div className="bg-white border border-neutral-200 rounded-2xl px-4 py-3 shadow-sm">
        <span className="inline-flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 bg-teal-500 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </span>
      </div>
    </motion.div>
  )
}

export function ChatArea({ messages, loading, onSend, onToggleChart }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  if (messages.length === 0 && !loading) {
    return <WelcomeScreen onSelect={onSend} />
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onToggleChart={() => onToggleChart(msg.id)}
          />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
