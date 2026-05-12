const API_URL = 'http://localhost:8000'

const API_RESPONSE = {
  answer: '',
  sql: '',
}

export interface QueryResponse {
  answer: string
  sql?: string
}

export async function askQuestion(question: string): Promise<QueryResponse> {
  const res = await fetch(`${API_URL}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  })

  if (!res.ok) {
    throw new Error(`Server error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()

  // Backend wraps the result in { answer: { answer, sql } }
  const inner = data.answer
  return {
    answer: typeof inner === 'string' ? inner : inner?.answer ?? '',
    sql: inner?.sql ?? '',
  }
}
