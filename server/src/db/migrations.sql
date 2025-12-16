CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  genre TEXT NOT NULL,
  price INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  cover_url TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  total_price INTEGER NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL
);

-- INSERT INTO products (id, title, artist, genre, price, stock, description, cover_url)
-- VALUES
--   (2, 'Abbey Road', 'The Beatles', 'rock', 4500, 12, 'Поздний шедевр Beatles.', '/images/beatles.png'),
--   (3, 'To Pimp a Butterfly', 'Kendrick Lamar', 'hip-hop', 3800, 14, 'Экспериментальный хип-хоп, получивший Пулитцеровскую премию.', 'https://images.unsplash.com/photo-1452723312111-3a7d0db0e024?auto=format&fit=crop&w=600&q=80')
-- ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('products', 'id'),
  COALESCE((SELECT MAX(id) FROM products), 1),
  true
);
