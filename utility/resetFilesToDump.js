
'use strict';

const glob = require('globby');
const _ = require('lodash');
const config = require('../config/mailroom');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const filePath = path.resolve(config.default.mailroom({}, false).filemakerImporter.sourceFolder);
    const files = await glob(`${filePath}/*.*`);
    _.forEach(files, (file) => {
      const types = ['full', 'upd', 'new', 'meta'];
      let isDumpFile = false;
      _.forEach(types, (type) => {
        if(file.indexOf(type) > -1)
          isDumpFile = true;
      });
      if(!isDumpFile)
        return;

      const newFileName = path.resolve(`${file.split('.')[0]}.dump`);
      const oldFileName = path.resolve(file);
      if(newFileName !== oldFileName)
        fs.renameSync(oldFileName, newFileName);
    });
    console.log('Done!');
  }
  catch(x) {
    console.error(x);
    process.exit(1);
  }
})();
