
DROP TABLE IF EXISTS menu_items CASCADE;

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY NOT NULL ,
  name VARCHAR(255),
  price SMALLINT,
  thumbnail_picture_url VARCHAR(255),
  description TEXT,
  category VARCHAR(255)

);
