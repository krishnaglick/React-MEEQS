
'use strict';
//Run me with 'babel-node migrate.js TARGET_FOLDER (up || down)'
exports.default = async function() {
  const fs = require('fs');
  const promise = require('bluebird');
  const path = require('path');
  const glob = require('globby');
  const _ = require('lodash');
  const pgp = require('pg-promise')({ promiseLib: promise });

  //See: http://stackoverflow.com/a/4351548/4783455
  const migrationsFolder = process.argv[2]; //'migrations' or 'databases'
  const migrationMode = process.argv[3]; //Should be up or down
  if(!migrationsFolder)
    return console.error('Please provide a folder!');
  if(!migrationMode)
    return console.error('Please choose a migration direction!');

  const config = require('../config/postgres');
  const db = pgp(config);

  if(config.debugLevel === 0)
    console.log(`Migration Mode: ${migrationMode}`);

  let migrationFiles = glob.sync(`${migrationsFolder}/*-${migrationMode}.sql`);
  if(migrationFiles.length < 1) {
    return console.error('No migrationFiles to process.');
  }
  migrationFiles = _.sortBy(migrationFiles, n => n);
  if(migrationMode === 'down')
    migrationFiles = migrationFiles.reverse();

  if(config.debugLevel === 0)
    console.log(`${migrationFiles.length} files`);

  const migrationTableExists = await db.oneOrNone('SELECT table_name FROM information_schema.tables WHERE table_name=\'migration\';');
  if(!migrationTableExists) {
    await db.tx((t) => {
      return t.batch([
        t.query('CREATE TABLE IF NOT EXISTS migration(name TEXT PRIMARY KEY, run_date TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp);'),
        t.query('GRANT ALL ON TABLE migration TO public;')
      ]);
    });
  }

  const migrations = [];
  let errors = [];
  _.forEach(migrationFiles, (file) => {
    try {
      const fileContent = fs.readFileSync(file, { encoding: 'utf8' });
      migrations.push({
        fileName: file,
        content: fileContent.toString()
      });
    }
    catch(x) {
      errors.push(x);
    }
  });

  if(errors.length)
    return console.error('There were errors reading files:\n', errors);
  let migrationResults = [];
  let migrationErrors = [];

  if(!migrations.length)
    return console.error('No migrations!?');

  await promise.each(migrations, async (migration) => {
    try {
      if(migrationMode === 'down') {
        const name = migration.fileName;
        const migrationName = name.replace('-down.','-up.');
        try {
          await db.tx((t) => {
            return t.batch([
              t.query(migration.content),
              t.query(`DELETE FROM migration WHERE name = \${migrationName};`, { migrationName })
            ]);
          });
          migrationResults.push(
            `${name.split(path.sep).slice(-1)} done!`
          );
        }
        catch(x) {
          migrationResults.push(
            `--${name.split(path.sep).slice(-1)} failed!`
          );
          throw x;
        }
      }
      else if(migrationMode === 'up') {
        const name = migration.fileName;
        const hasRunMigration = await db.oneOrNone(`
          SELECT * FROM migration
          WHERE name = \${name};`,
          { name });
        if(!hasRunMigration) {
          try {
            await db.tx((t) => {
              return t.batch([
                t.query(`INSERT INTO migration(name) VALUES(\${name});`, { name }),
                t.query(migration.content)
              ]);
            });
            migrationResults.push(
              `${name.split(path.sep).slice(-1)} successful!`
            );
          }
          catch(x) {
            migrationResults.push(
              `--${name.split(path.sep).slice(-1)} failed!`
            );
            throw x;
          }
        }
        else {
          migrationResults.push(
            `${name.split(path.sep).slice(-1)} skipped!`
          );
        }
      }
    }
    catch(x) {
      migrationErrors.push({
        error: x,
        file: migration.fileName
      });
    }
  });

  if(migrationMode === 'down' && !migrationErrors.length && !errors.length)
    await db.none('truncate table migration;');

  if(config.debugLevel === 0) {
    if(migrationResults.length)
      console.log(migrationResults);
    if(migrationErrors.length)
      console.error(migrationErrors);
  }
  else {
    if(migrationResults.length) {
      console.log(`${migrationResults.length} successes`);
    }
    if(migrationErrors.length) {
      console.error(_.map(migrationErrors, (error) => {
        return {
          error: error.error.toString(),
          file: error.file
        };
      }));
    }
  }

  pgp.end();
  process.exit(0);
};

(async () => {
  try {
    await exports.default();
  }
  catch(x) {
    console.error(x);
  }
})();
