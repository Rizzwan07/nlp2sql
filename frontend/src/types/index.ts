export interface QueryResponse {
  answer: string
  sql?: string
  columns?: string[]
  rows?: Record<string, unknown>[]
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sql?: string
  columns?: string[]
  rows?: Record<string, unknown>[]
  error?: boolean
  showChart?: boolean
  timestamp: number
}

export interface HistoryEntry {
  id: string
  question: string
  timestamp: number
}

export type ChartType = 'bar' | 'line' | 'pie' | 'stat'
