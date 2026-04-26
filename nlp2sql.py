from backend.src.nlp2sql import query_database

if __name__ == "__main__":
    print("=" * 40)
    print("NLP2SQL - Ask questions about your data")
    print("=" * 40)
    print("Type 'exit' to quit")
    
    while True:
        question = input("\nAsk: ").strip()
        
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