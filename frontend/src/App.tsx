import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { askQuestion } from './api/query'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sql?: string
  error?: boolean
}

const examples = [
  'How many users are there?',
  'Show me all products',
  'What are the top 5 orders by total?',
  'List all users from USA',
  'How many orders are pending?',
]

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 bg-slate-400 rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </span>
  )
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [expandedSql, setExpandedSql] = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [loading])

  const handleSubmit = async (question?: string) => {
    const q = (question ?? input).trim()
    if (!q || loading) return
    setInput('')
    setExpandedSql(null)
    setMessages((prev) => [...prev, { role: 'user', content: q }])
    setLoading(true)

    try {
      const data = await askQuestion(q)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer || 'No response',
          sql: data.sql || undefined,
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Could not reach the server. Make sure `python main.py` is running on port 8000.',
          error: true,
        },
      ])
    }
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const toggleSql = (index: number) => {
    setExpandedSql(expandedSql === index ? null : index)
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <span className="text-2xl">🗄️</span>
          <div>
            <h1 className="text-xl font-bold tracking-tight">NLP2SQL</h1>
            <p className="text-indigo-200 text-sm">
              Ask questions in plain English — get answers from your database
            </p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 && !loading && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-6">🗄️</div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                  Welcome to NLP2SQL
                </h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                  Type a question below or try one of these examples:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {examples.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => handleSubmit(ex)}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm transition-all"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={`msg-${i}`}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-md'
                      : msg.error
                        ? 'bg-red-50 border border-red-200 text-red-700 rounded-bl-md'
                        : 'bg-white border border-slate-200 shadow-sm rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  {msg.role === 'assistant' && msg.sql && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => toggleSql(i)}
                        className="text-xs font-mono text-indigo-500 hover:text-indigo-700 transition-colors flex items-center gap-1"
                      >
                        <svg
                          className={`w-3 h-3 transition-transform ${expandedSql === i ? 'rotate-90' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {expandedSql === i ? 'Hide SQL' : 'Show SQL'}
                      </button>
                      <AnimatePresence>
                        {expandedSql === i && (
                          <motion.pre
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <code className="mt-2 block bg-slate-900 text-slate-100 text-xs font-mono rounded-lg p-3 whitespace-pre-wrap">
                              {msg.sql}
                            </code>
                          </motion.pre>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-bl-md px-5 py-4">
                  <TypingDots />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={() => handleSubmit()}
            disabled={loading || !input.trim()}
            className="rounded-xl bg-indigo-600 text-white px-5 py-3 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                </svg>
                Send
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
