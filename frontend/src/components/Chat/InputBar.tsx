import { useState, useRef, useEffect } from 'react'
import { ArrowUp, Loader2 } from 'lucide-react'

interface InputBarProps {
  onSend: (message: string) => void
  loading: boolean
}

export function InputBar({ onSend, loading }: InputBarProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading) inputRef.current?.focus()
  }, [loading])

  const handleSubmit = () => {
    if (!input.trim() || loading) return
    onSend(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="px-4 pb-4 pt-2 shrink-0">
      <div className="max-w-2xl mx-auto relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your data..."
          disabled={loading}
          className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 pr-12 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all disabled:opacity-50 shadow-sm"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center disabled:bg-neutral-200 disabled:text-neutral-400 hover:bg-teal-700 transition-colors"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <ArrowUp size={15} />
          )}
        </button>
      </div>
    </div>
  )
}
