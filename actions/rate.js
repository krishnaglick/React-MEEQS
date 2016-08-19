
'use strict';

const uuid = require('uuid');

exports.action = {
  name:                   'rate',
  description:            'Rates a restaurant',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             [],

  inputs: {
    place_id: { required: true },
    name: { required: true },
    location: { required: true },
    menu: { required: true },
    efficiency: { required: true },
    environment: { required: true },
    quality: { required: true },
    service: { required: true }
  },

  run: async function(api, data, next) {
    try {
      data.params.uuid = await api.db.oneOrNone(`
        SELECT id
        FROM restaurants
        WHERE google_id = \${place_id};
      `, data.params);
      if(data.params.uuid)
        data.params.uuid = data.params.uuid.id;
      else
        data.params.uuid = uuid.v4();
      await api.db.none(`
        INSERT INTO restaurants
        VALUES (
          \${uuid},
          \${place_id},
          \${name},
          \${location}
        )
        ON CONFLICT (google_id) DO UPDATE
        SET location = \${location}, name = \${name};

        INSERT INTO ratings(restaurant_id, menu, efficiency, environment, quality, service)
        VALUES (
          \${uuid},
          \${menu},
          \${efficiency},
          \${environment},
          \${quality},
          \${service}
        );
      `, data.params);
      next();
    }
    catch(x) {
      next(x);
    }
  }
};
