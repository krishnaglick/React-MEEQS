
'use strict';

const child_promise = require('./blueChild');

const pgInfo = require('../config/postgres');

const dbOwnerName = pgInfo.user;
const dbOwnerPassword = pgInfo.password;
const dbName = pgInfo.database;
const dbSuperuser = pgInfo.superuser || dbOwnerName;
const isWin = /^win/.test(process.platform);

const suQueryWrapper = (query) => {
  if(isWin)
    return child_promise('psql', [
      `-U`,
      dbSuperuser,
      `-c`,
      query
    ]);
  else
    return child_promise('sudo', [
      `-u`,
      dbSuperuser,
      'psql',
      `-c`,
      query
    ]);
};

const queryWrapper = (query) => {
  //NOTE: This doesn't work right, prompts for password.
  return child_promise('psql', [
    `-U`,
    dbOwnerName,
    `-d`,
    dbName,
    `-c`,
    query
  ]);
};

(async () => {
  const errors = [];
  try {
    await suQueryWrapper(`
      CREATE USER ${dbOwnerName}
      WITH PASSWORD '${dbOwnerPassword}'
      VALID UNTIL 'infinity';`
    );
  }
  catch(x) {
    errors.push(x);
  }
  try {
    await suQueryWrapper(`
      ALTER USER ${dbOwnerName} WITH SUPERUSER CREATEDB CREATEROLE REPLICATION;
    `);
  }
  catch(x) {
    errors.push(x);
  }
  try {
    await suQueryWrapper(`
      CREATE DATABASE ${dbName}
      WITH OWNER=${dbOwnerName}
      ENCODING='UTF8';
    `);
  }
  catch(x) {
    errors.push(x);
  }
  try {
    await suQueryWrapper(`
      GRANT ALL PRIVILEGES
      ON DATABASE ${dbName}
      TO ${dbOwnerName};
    `);
  }
  catch(x) {
    errors.push(x);
  }
  try {
    await queryWrapper(`
      GRANT ALL PRIVILEGES
      ON SCHEMA public
      TO ${dbOwnerName};
    `);
  }
  catch(x) {
    errors.push(x);
  }
  try {
    await queryWrapper(`
      REVOKE ALL PRIVILEGES
      ON SCHEMA public
      FROM public;
    `);
  }
  catch(x) {
    errors.push(x);
  }
  if(errors.length)
    console.error(errors.join('\n'));
  process.exit(0);
})();
