import duckdb
import random
from datetime import datetime, timedelta

conn = duckdb.connect('backend/src/database.duckdb')

conn.execute('DROP TABLE IF EXISTS orders')
conn.execute('DROP TABLE IF EXISTS products')
conn.execute('DROP TABLE IF EXISTS users')

conn.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), country VARCHAR(100), is_active BOOLEAN, created_at TIMESTAMP)')
conn.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, product_name VARCHAR(255), category VARCHAR(100), quantity INTEGER, total DECIMAL(10,2), status VARCHAR(50), order_date DATE)')
conn.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name VARCHAR(255), category VARCHAR(100), price DECIMAL(10,2), stock INTEGER)')

countries = ['USA', 'UK', 'Canada', 'Australia', 'Germany']
names = ['John Smith', 'Emma Wilson', 'Michael Brown', 'Sophia Davis', 'James Johnson']

for i in range(1, 51):
    name = random.choice(names)
    email = f'{name.lower().replace(" ", ".")}{i}@example.com'
    country = random.choice(countries)
    is_active = random.choice([True, False])
    days_ago = random.randint(1, 365)
    created = (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d %H:%M:%S')
    conn.execute(f"INSERT INTO users VALUES ({i}, '{name}', '{email}', '{country}', {is_active}, '{created}')")

products_list = [
    ('Laptop', 'Electronics', 1299.99, 50),
    ('Wireless Mouse', 'Electronics', 39.99, 200),
    ('Mechanical Keyboard', 'Electronics', 129.99, 150),
    ('HD Monitor 27in', 'Electronics', 399.99, 75),
    ('USB-C Hub', 'Electronics', 49.99, 300),
    ('Office Chair Deluxe', 'Furniture', 349.99, 30),
    ('Standing Desk', 'Furniture', 599.99, 25),
    ('LED Desk Lamp', 'Furniture', 69.99, 100),
    ('A4 Notebooks Pack', 'Office', 14.99, 500),
    ('Premium Pen Set', 'Office', 24.99, 250),
    ('Webcam HD', 'Electronics', 89.99, 120),
    ('Noise Headphones', 'Electronics', 199.99, 80)
]

for i, (name, cat, price, stock) in enumerate(products_list, 1):
    conn.execute(f"INSERT INTO products VALUES ({i}, '{name}', '{cat}', {price}, {stock})")

products = ['Laptop', 'Headphones', 'Keyboard', 'Mouse', 'Monitor', 'Desk Chair', 'Desk', 'Lamp', 'Notebook', 'Pen Set']
categories = ['Electronics', 'Electronics', 'Electronics', 'Electronics', 'Electronics', 'Furniture', 'Furniture', 'Furniture', 'Office', 'Office']
statuses = ['pending', 'completed', 'cancelled', 'shipped']

for i in range(1, 101):
    user_id = random.randint(1, 50)
    idx = random.randint(0, len(products)-1)
    product_name = products[idx]
    category = categories[idx]
    qty = random.randint(1, 5)
    total_val = round(random.uniform(10, 1000), 2)
    status = random.choice(statuses)
    order_date = (datetime.now() - timedelta(days=random.randint(1, 180))).strftime('%Y-%m-%d')
    conn.execute(f"INSERT INTO orders VALUES ({i}, {user_id}, '{product_name}', '{category}', {qty}, {total_val}, '{status}', '{order_date}')")

conn.close()
print('Database created!')
print('Tables: users (50), orders (100), products (12)')