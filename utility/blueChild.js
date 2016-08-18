
'use strict';

const bluebird = require('bluebird');
const child_process = require('child_process');
const options = {
  maxBuffer: 512000000
};

module.exports = (mainArg, subArgs) => {
  return new bluebird.Promise((res, rej) => {
    if(!subArgs) {
      child_process.exec(mainArg, options, (err) => {
        if(err) return rej(err);
        res();
      });
    }
    else {
      child_process.execFile(mainArg, subArgs, options, (err) => {
        if(err) return rej(err);
        res();
      });
    }
  });
};
