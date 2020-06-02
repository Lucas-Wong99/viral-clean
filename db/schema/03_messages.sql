-- Drop and recreate Messages table

DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE messages (
  id SERIAL PRIMARY KEY NOT NULL,
  user_1_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  user_2_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW()
);
