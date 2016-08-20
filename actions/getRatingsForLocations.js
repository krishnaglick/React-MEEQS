
'use strict';

const _ = require('lodash');

exports.action = {
  name:                   'getRatingsForLocations',
  description:            'Gets the MEEQS ratings for an array of restaurants',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             [],

  inputs: {
    placeIDs: { required: true }
  },

  run: async function(api, data, next) {
    try {
      const placeIDs = _.map(data.params.placeIDs.split(','), (id) => id.replace(/'/g, ''));
      const meeqsRatings = await api.db.many(_.map(placeIDs, (placeID) => {
        return `
          SELECT
            AVG(menu) AS menu,
            AVG(efficiency) AS efficiency,
            AVG(environment) AS environment,
            AVG(quality) AS quality,
            AVG(service) AS service,
            MAX(r.google_id) AS place_id
          FROM ratings ra
          INNER JOIN restaurants r
          ON r.id = ra.restaurant_id
          WHERE r.google_id = '${placeID}'
          GROUP BY r.id;
        `;
      }).join('\n'));
      data.response = meeqsRatings;
      next();
    }
    catch(x) {
      next(x);
    }
  }
};
