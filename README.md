# NLP2SQL

A natural language to SQL chatbot with a React frontend, powered by Groq, LangGraph, and DuckDB. Ask questions in plain English and get answers with SQL, data tables, and interactive charts.

## Features

- Natural language to SQL conversion using LangGraph agent
- Groq LLM (llama-3.3-70b-versatile) for intelligent query understanding
- DuckDB for fast in-memory database operations
- React frontend with inline chart visualization (Recharts)
- Query history sidebar
- SQL validation (SELECT/UPDATE only - safe queries)
- Natural language responses from query results
- Auto-detect chart type (bar, line, pie, stat)
- LangSmith tracing for debugging (optional)

## Tech Stack

**Backend:**
- Python 3.11+
- Groq - LLM API (free tier available)
- LangGraph - Agent orchestration
- DuckDB - In-memory SQL database
- FastAPI - API server
- LangSmith - Tracing (optional)

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts - Data visualization
- Framer Motion - Animations
- Lucide React - Icons

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Rizzwan07/nlp2sql.git
cd nlp2sql
```

### 2. Create Virtual Environment

```bash
# Windows
python -m venv nlpevn
.\nlpevn\Scripts\Activate

# Linux/Mac
python -m venv nlpevn
source nlpevn/bin/activate
```

### 3. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### 4. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 5. Get API Keys

**Groq** (free tier): https://console.groq.com
**LangSmith** (optional): https://smith.langchain.com

### 6. Configure Environment Variables

Copy `.env.example` to `.env` and add your keys:

```bash
GROQ_API_KEY=your_groq_key_here
LANGCHAIN_API_KEY=your_langsmith_key_here
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=nlp2sql
```

### 7. Run Database Setup

```bash
python setup_db.py
```

This creates sample data in `backend/database.duckdb` with tables:
- users (50 rows)
- orders (100 rows)
- products (12 rows)

### 8. Run the Application

Start the backend:
```bash
python main.py
```

Start the frontend (in a separate terminal):
```bash
cd frontend
npm run dev
```

Open http://localhost:5173 in your browser.

## Example Questions

### Bar Charts
- "Show total orders by category"
- "Which products have stock below 50?"
- "Show order quantity by product name"
- "Total revenue per product category"
- "Number of orders per status"

### Pie Charts
- "Show orders by status"
- "How many users per country?"
- "Orders distribution by category"
- "Active vs inactive users"
- "Product distribution by category"

### Line Charts
- "Show orders over time by date"
- "Daily order totals for the last month"
- "Order count per day"
- "Show cumulative order count by order_date"
- "Total revenue by order date"

### Stats (Single Value)
- "How many active users are there?"
- "What is the total revenue?"
- "How many orders are pending?"
- "What is the average order total?"
- "How many products do we have?"

### Tables
- "List all products with their prices"
- "Top 5 orders by total amount"
- "Show users from USA with their emails"
- "List all pending orders"
- "Show me all products in Electronics category"

### Aggregations & Comparisons
- "Which country has the most users?"
- "What is the most ordered product?"
- "Compare pending vs completed orders"
- "Average order total by category"
- "Which user has the most orders?"

### Joins
- "Show user names with their order totals"
- "List users from USA with their order count"
- "Which users have never ordered?"
- "Show product names with total quantity ordered"

### Updates
- "Update user with id 1 to be inactive"
- "Set all pending orders to completed"

## Database Schema

### users

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | VARCHAR(255) | User full name |
| email | VARCHAR(255) | Email address |
| country | VARCHAR(100) | Country name |
| is_active | BOOLEAN | Account active status |
| created_at | TIMESTAMP | Account creation time |

### orders

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| user_id | INTEGER | Foreign key to users |
| product_name | VARCHAR(255) | Product name |
| category | VARCHAR(100) | Product category |
| quantity | INTEGER | Order quantity |
| total | DECIMAL(10,2) | Order total amount |
| status | VARCHAR(50) | pending/completed/cancelled/shipped |
| order_date | DATE | Order date |

### products

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | VARCHAR(255) | Product name |
| category | VARCHAR(100) | Product category |
| price | DECIMAL(10,2) | Product price |
| stock | INTEGER | Stock quantity |

## Project Structure

```
nlp2sql/
├── backend/
│   ├── nlp2sql.py          # Core NLP2SQL engine (LangGraph pipeline)
│   ├── schema.json         # Database schema definition
│   └── database.duckdb     # DuckDB database file
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── api/query.ts
│   │   ├── components/
│   │   │   ├── Chat/       # ChatArea, MessageBubble, InputBar, WelcomeScreen
│   │   │   ├── Results/    # ChartView, DataTable, SqlBlock
│   │   │   ├── Sidebar/    # QueryHistory
│   │   │   └── Layout/     # Header
│   │   ├── hooks/useChat.ts
│   │   ├── types/index.ts
│   │   └── utils/chartHelper.ts
│   └── package.json
├── nlp2sql.py              # CLI entry point
├── main.py                 # FastAPI server
├── setup_db.py             # Database seed script
├── requirements.txt        # Python dependencies
└── .env                    # Environment variables (gitignored)
```

## How It Works

```
User Question
    │
    ▼
┌─────────────────────────────┐
│ generate_sql_node           │
│ (LLM converts NL → SQL)    │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│ SQL Validation              │
│ (SELECT/UPDATE only)        │
└─────────────────────────────┘
    │
    ├── Valid ──► execute_node (runs SQL on DuckDB)
    │                  │
    │                  ▼
    │            format_node (LLM formats as natural language)
    │                  │
    │                  ▼
    └──────────► Frontend renders answer + table + chart
```

## API

### POST /query

```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "How many users are there?"}'
```

Response:
```json
{
  "answer": "There are 50 users in the database.",
  "sql": "SELECT COUNT(*) as count FROM \"main\".\"users\" LIMIT 100;",
  "columns": ["count"],
  "rows": [{"count": 50}]
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| GROQ_API_KEY | Yes | Get from console.groq.com |
| LANGCHAIN_API_KEY | No | For LangSmith tracing |
| LANGCHAIN_TRACING_V2 | No | Set to "true" to enable tracing |
| LANGCHAIN_PROJECT | No | Project name for LangSmith |

## Troubleshooting

### "Rate limit reached" error
The free Groq tier has a 100k tokens/day limit. Wait for reset or switch model in `backend/nlp2sql.py`:
```python
llm = ChatGroq(model="llama-3.1-8b-instant")  # lower quality but separate limit
```

### "Invalid API Key" error
Check your `.env` file has the correct `GROQ_API_KEY`. Restart the backend after changing it.

### "Model not found" error
Update the model name in `backend/nlp2sql.py`.

### Empty chart / blank visualization
Some queries return data that doesn't map well to charts. Try questions that return a category + numeric column.

### Frontend can't connect
Make sure the backend is running on port 8000 (`python main.py`) before starting the frontend.

## License

MIT

---

Built with [Groq](https://groq.com) + [LangGraph](https://langgraph.ai) + [DuckDB](https://duckdb.org) + [React](https://react.dev) + [Recharts](https://recharts.org)
