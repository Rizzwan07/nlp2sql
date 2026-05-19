from backend.nlp2sql import query_database
import os

os.environ.setdefault('GROQ_API_KEY', os.getenv('GROQ_API_KEY', ''))
os.environ.setdefault('LANGCHAIN_API_KEY', os.getenv('LANGCHAIN_API_KEY', ''))

def main():
    print("=" * 50)
    print("NLP2SQL CLI")
    print("=" * 50)
    print("Type 'exit' or 'quit' to stop")
    print("-" * 50)
    
    while True:
        try:
            question = input("\nAsk a question: ").strip()
            
            if question.lower() in ('exit', 'quit', 'q'):
                print("Goodbye!")
                break
            
            if not question:
                continue
            
            result = query_database(question)
            
            print(f"\nSQL: {result.get('sql', 'N/A')}")
            print(f"\nAnswer: {result.get('answer', 'N/A')}")
            
            if result.get('error'):
                print(f"Error: {result.get('error')}")
                
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()