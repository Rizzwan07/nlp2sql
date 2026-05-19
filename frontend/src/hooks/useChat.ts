import { useState, useCallback } from 'react'
import type { Message, HistoryEntry } from '../types'
import { askQuestion } from '../api/query'

let msgId = 0
const genId = () => `msg-${++msgId}-${Date.now()}`

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(false)

  const sendMessage = useCallback(async (question: string) => {
    if (!question.trim() || loading) return

    const userMsg: Message = {
      id: genId(),
      role: 'user',
      content: question.trim(),
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMsg])
    setHistory((prev) => [...prev, { id: userMsg.id, question: question.trim(), timestamp: Date.now() }])
    setLoading(true)

    try {
      const data = await askQuestion(question.trim())
      const assistantMsg: Message = {
        id: genId(),
        role: 'assistant',
        content: data.answer || 'No response',
        sql: data.sql || undefined,
        columns: data.columns,
        rows: data.rows,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      const errorMsg: Message = {
        id: genId(),
        role: 'assistant',
        content: 'Could not reach the server. Make sure the backend is running on port 8000.',
        error: true,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, errorMsg])
    }

    setLoading(false)
  }, [loading])

  const toggleChart = useCallback((msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, showChart: !m.showChart } : m))
    )
  }, [])

  const newChat = useCallback(() => {
    setMessages([])
  }, [])

  return { messages, history, loading, sendMessage, toggleChart, newChat }
}
