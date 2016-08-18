
'use strict';

const child_promise = require('./blueChild');
const rmqConfig = require('../config/mq').connection;
const { user, pass, vhost } = rmqConfig;

const commandPrefix = require(`os`).platform() !== `win32` ? 'sudo ' : '';
const commandSuffix = require(`os`).platform() === `win32` ? '.bat' : '';

(async () => {
  try {
    await child_promise(`${commandPrefix}rabbitmqctl${commandSuffix} stop_app`);
    await child_promise(`${commandPrefix}rabbitmqctl${commandSuffix} force_reset`);
    await child_promise(`${commandPrefix}rabbitmqctl${commandSuffix} start_app`);
    await child_promise(`${commandPrefix}rabbitmqctl${commandSuffix} change_password guest ${pass}`);
    await child_promise(`${commandPrefix}rabbitmqctl${commandSuffix} add_user ${user} ${pass}`);
    await child_promise(`${commandPrefix}rabbitmqctl${commandSuffix} add_vhost ${vhost}`);
    await child_promise(`${commandPrefix}rabbitmqctl${commandSuffix} set_user_tags ${user} administrator`);
    await child_promise(`${commandPrefix}rabbitmqctl${commandSuffix} set_permissions -p ${vhost} ${user} ".*" ".*" ".*"`);
    console.log('RabbitMQ Successfully Reset!');
    process.exit(0);
  }
  catch(x) {
    console.error(x);
    process.exit(1);
  }
})();
