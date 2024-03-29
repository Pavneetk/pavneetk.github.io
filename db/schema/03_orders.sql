
DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL references users(id) ON DELETE CASCADE,
  status VARCHAR(255) NOT NULL DEFAULT 'open',
  date TIMESTAMP WITH TIME ZONE NOT NULL
                DEFAULT CURRENT_TIMESTAMP
);


