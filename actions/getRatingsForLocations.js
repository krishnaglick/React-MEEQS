
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
    locations: { required: true }
  },

  run: async function(api, data, next) {
    console.log(data.params);
    try {
      const placeIDs = _.map(data.params.locations, (l) => l.place_id.replace(/'/g, ''));
      const meeqsRatings = await api.db.many(_.map(placeIDs, (placeID) => {
        return `
          SELECT AVG(menu) AS menu, AVG(efficiency) AS efficiency, AVG(environment) AS environment, AVG(quality) AS quality, AVG(service) AS service
          FROM ratings ra
          INNER JOIN restaurants r
          ON r.id = ra.restaurant_id
          WHERE r.google_id = '${placeID}'
          GROUP BY r.id
        `;
      }).join('\n'));
      data.response.ratings = meeqsRatings;
      next();
    }
    catch(x) {
      next(x);
    }
  }
};
