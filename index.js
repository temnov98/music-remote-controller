const robot = require("robotjs");
const express = require('express');
const fs = require('fs');
const os = require('os');

// #region Constants

const port = 3000;
const availableCommands = [
  'audio_mute',
  'audio_play',
  'audio_pause',
  'audio_prev',
  'audio_next',
  'audio_vol_down',
  'audio_vol_up',
];

// #endregion

// #region Functions

function setCommand(app, command) {
  app.post(`/commands/${command}`, (req, res) => {
    robot.keyTap(command);
    res.send({ ok: true });
  });
}

function getLocalIpAddresses() {
  return Object.entries(os.networkInterfaces())
    .reduce((previousValue, currentValue) => previousValue.concat(currentValue[1]), [])
    .filter(item => (item.family === 'IPv4' && item.netmask === '255.255.255.0'))
    .map(item => item.address);
}

function printInfo() {
  console.log('Local IP addresses:');
  const localIpAddresses = getLocalIpAddresses();
  localIpAddresses.forEach(address => console.log(address));
  console.log();
}

// #endregion

function main() {
  printInfo();

  const app = express();

  app.get('/', (req, res) => {
    const content = fs.readFileSync('./index.html').toString();
    res.send(content);
  });

  availableCommands.forEach(command => setCommand(app, command));

  app.listen(port, () => console.log(`Started on port: ${port}`));
}

main();
