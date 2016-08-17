
'use strict';

exports.action = {
  name:                   'rate',
  description:            'Rates a restuarant',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             [],

  inputs: {
    name: { required: true },
    menu: { required: true },
    efficiency: { required: true },
    environment: { required: true },
    quality: { required: true },
    service: { required: true }
  },

  run: function(api, data, next) {
    let error = null;
    console.log(data);
    // your logic here
    next(error);
  }
};
