'use strict';
const exec = require('shelljs').exec;
const os = require('os');

const isWindows = os.platform === 'win32';

let isCommandExists = (command) => {
  if (!command) throw new Error('Command Exist Check Error: need a command for check');
  if (isWindows) {
    return windowsCommandCheck(command);
  } else {
    return unixCommandCheck(command);
  }
};

let unixCommandCheck = (command) => {
  let result = exec(`command -v ${ command }`, { silent: true });
  return !!result.stdout;
};

let windowsCommandCheck = (command) => {
  let result = exec(`where ${ command }`, { silent: true });
  return !!result.stdout;
};

module.exports = isCommandExists;
