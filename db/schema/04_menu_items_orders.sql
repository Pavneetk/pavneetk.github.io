
DROP TABLE IF EXISTS menu_items_orders CASCADE;

CREATE TABLE menu_items_orders (
  id SERIAL PRIMARY KEY NOT NULL,
  order_id INTEGER NOT NULL references orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER references menu_items(id) ON DELETE CASCADE,
  quantity SMALLINT

);
