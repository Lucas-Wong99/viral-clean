-- DROP TABLE IF EXISTS items CASCADE;

-- CREATE TABLE items (
--   id SERIAL PRIMARY KEY NOT NULL,
--   seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   name VARCHAR(255) NOT NULL,
--   description TEXT,
--   price INTEGER NOT NULL,
--   image_url VARCHAR(255),
--   date_listed TIMESTAMP NOT NULL DEFAULT NOW(),
--   city VARCHAR(255) NOT NULL,
--   is_sold BOOLEAN NOT NULL DEFAULT false,
--   is_deleted BOOLEAN NOT NULL DEFAULT false
-- );
