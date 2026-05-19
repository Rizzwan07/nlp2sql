import type { QueryResponse } from '../types'

const API_URL = 'http://localhost:8000'

export async function askQuestion(question: string): Promise<QueryResponse> {
  const res = await fetch(`${API_URL}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  })

  if (!res.ok) {
    throw new Error(`Server error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
