
CREATE TABLE IF NOT EXISTS ratings (
  id               UUID DEFAULT uuid_generate_v1mc(),

  restaurant_id    UUID,

  menu             SMALLINT NOT NULL,
  efficiency       SMALLINT NOT NULL,
  environment      SMALLINT NOT NULL,
  quality          SMALLINT NOT NULL,
  service          SMALLINT NOT NULL,
  -- Keys
  CONSTRAINT ratings_pk PRIMARY KEY (id),
  -- Foreign Keys
  CONSTRAINT rating_restaurant_fk FOREIGN KEY (restaurant_id)
    REFERENCES restaurants (id)
);
