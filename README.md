# NLP2SQL

A natural language to SQL chatbot powered by Groq, LangGraph, and DuckDB.

## Features

- Natural language to SQL conversion using LangGraph agent
- Groq LLM (llama-3.3-70b) for intelligent query understanding
- DuckDB for fast in-memory database operations
- Chat history support for context-aware responses
- SQL validation (SELECT/UPDATE only - safe queries)
- Natural language responses from query results
- LangSmith tracing for debugging and monitoring

## Tech Stack

- **Python 3.11+**
- **Groq** - LLM API (free tier available)
- **LangGraph** - Agent orchestration
- **DuckDB** - In-memory SQL database
- **LangSmith** - Tracing (optional)
- **FastAPI** - API server

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

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Get API Keys

**Groq** (free tier): https://console.groq.com  
**LangSmith** (optional): https://smith.langchain.com

### 5. Configure Environment Variables

Copy `.env.example` to `.env` and add your keys:

```bash
# .env file
GROQ_API_KEY=your_groq_key_here
LANGCHAIN_API_KEY=your_langsmith_key_here
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=nlp2sql
```

### 6. Run Database Setup

```bash
python setup_db.py
```

This creates sample data in `backend/src/database.duckdb` with tables:
- users (50 rows)
- orders (100 rows)
- products (12 rows)

### 7. Run the Application

**CLI (interactive):**
```bash
python nlp2sql.py
```

Then type your questions. Type `exit` to quit.

**API Server:**
```bash
python main.py
# Open http://localhost:8000
```

Test the API:
```bash
curl -X POST http://localhost:8000/query -H "Content-Type: application/json" -d '{"question": "How many users?"}'
```

## Example Questions

Try these questions in the CLI:

- "How many users are there?"
- "Show me all products"
- "What are the top 5 orders by total?"
- "List all users from USA"
- "How many orders are pending?"
- "Show me products with price less than 100"

## Database Schema

### users

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-generated |
| name | VARCHAR(255) | User full name |
| email | VARCHAR(255) | Email address |
| country | VARCHAR(100) | Country name |
| is_active | BOOLEAN | Account active status |
| created_at | TIMESTAMP | Account creation time |

### orders

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-generated |
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
├── backend/src/
│   ├── nlp2sql.py      # Core NLP2SQL engine
│   ├── schema.json     # Database schema definition
│   └── database.duckdb # DuckDB database file
├─�� nlp2sql.py          # CLI runner (main entry point)
├── main.py            # FastAPI server
├── requirements.txt   # Python dependencies
├── setup_db.py        # Database setup script
├── .env              # Environment variables (gitignored)
├── .env.example      # Template for .env
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## How It Works

The NLP2SQL engine uses LangGraph to orchestrate the conversation flow:

```
User Question
    │
    ▼
┌─────────────────────────────────────┐
│ generate_sql_node                   │
│ (LLM generates SQL + uses tools)   │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ SQL Validation                     │
│ (Checks: SELECT/UPDATE only)       │
└─────────────────────────────────────┘
    │
    ├── Valid ──► ┌──────────────────┐
    │             │ execute_node      │
    │             │ (Runs SQL on DB)   │
    │             └──────────────────┘
    │                    │
    └───────────────────────────────► ┌──────────────────┐
                                  │ format_node    │
                                  │ (LLM formats  │
                                  │  as natural   │
                                  │  language)   │
                                  └──────────────────┘
                                        │
                                        ▼
                                   Final Answer
```

### Nodes

1. **generate_sql_node** - Uses LLM to convert natural language to SQL
2. **execute_node** - Runs the SQL on DuckDB
3. **format_node** - Converts results back to natural language

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| GROQ_API_KEY | Yes | Get from console.groq.com |
| LANGCHAIN_API_KEY | No | For LangSmith tracing |
| LANGCHAIN_TRACING_V2 | No | Set to "true" to enable tracing |
| LANGCHAIN_PROJECT | No | Project name for LangSmith |

## Known Limitations

- Frontend not included yet (coming soon)
- Prompt optimized for current schema - you can customize rules in `backend/src/nlp2sql.py`
- Only SELECT and UPDATE queries allowed (for security)
- Database resets on server restart (in-memory)

## Troubleshooting

### "Model not found" error
Update the model name in `backend/src/nlp2sql.py`:
```python
llm = ChatGroq(model="llama-3.3-70b-versatile")
```

### "Connection refused" error
Make sure your API key is correct in `.env` file.

### Empty results
Check that `setup_db.py` has run successfully and `database.duckdb` exists.

## License

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

Built with [Groq](https://groq.com) + [LangGraph](https://langgraph.ai) + [DuckDB](https://duckdb.org)