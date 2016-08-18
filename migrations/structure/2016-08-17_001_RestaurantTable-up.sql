
CREATE TABLE IF NOT EXISTS restaurants (
  id               UUID DEFAULT uuid_generate_v1mc(),

  google_id        TEXT NOT NULL UNIQUE,
  name             TEXT NOT NULL,
  location         TEXT NOT NULL,

  -- Keys
  CONSTRAINT restaurants_pk PRIMARY KEY (id)
);
