
'use strict';

module.exports = getPostgresConnection();

//I'm doing all this due to testing of various CI products
//and it gets annoying trying to hack everything together elsewhere.
function getPostgresConnection() {
  let postgresConnection = {};
  try {
    if(process.env.NODE_ENV !== 'test') {
      postgresConnection = require(`../local/postgresConnection`);
    }
    else {
      postgresConnection = require(`../test/postgresConnection`);
    }
  }
  catch(x) {
    postgresConnection = getConnectionFromEnvironment(postgresConnection);
    console.error('Error loading Postgres connection: ', x.message);
  }

  postgresConnection.user = getUser(postgresConnection);
  postgresConnection.password = getPassword(postgresConnection);
  postgresConnection.host = getHost(postgresConnection);
  postgresConnection.port = getPort(postgresConnection);
  postgresConnection.database = getDatabase(postgresConnection);
  postgresConnection.dialect = getDialect(postgresConnection);
  postgresConnection.debugLevel = getDebugLevel(postgresConnection);
  postgresConnection.superuser = getSuperuser(postgresConnection);

  return postgresConnection;
}

function getConnectionFromEnvironment(postgresConnection) {
  return process.env.POSTGRES_TEST_CONNECTION ||
    postgresConnection;
}

function getUser(postgresConnection) {
  return postgresConnection.user ||
    process.env.POSTGRES_USER;
}

function getPassword(postgresConnection) {
  return postgresConnection.password ||
    process.env.POSTGRES_PASSWORD;
}

function getHost(postgresConnection) {
  return postgresConnection.host ||
    process.env.POSTGRES_HOST ||
    'localhost';
}

function getPort(postgresConnection) {
  return postgresConnection.port ||
    process.env.POSTGRES_PORT ||
    5432;
}

function getDatabase(postgresConnection) {
  return postgresConnection.database ||
    process.env.POSTGRES_DATABASE ||
    'cinnamon_roost';
}

function getDialect(postgresConnection) {
  return postgresConnection.dialect ||
    process.env.POSTGRES_DIALECT ||
    'postgres';
}

function getDebugLevel(postgresConnection) {
  return postgresConnection.debugLevel ||
    0;
}

function getSuperuser(postgresConnection) {
  return postgresConnection.superuser ||
  process.env.POSTGRES_SUPERUSER ||
  'postgres';
}
