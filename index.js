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

function readFileAsync(filename) {
  console.log(filename);

  return new Promise((resolve, reject) => {
    fs.readFile(filename, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    })
  });
}

function getFileLoader(filename, ) {
  return async function(req, res) {
    const content = await readFileAsync(filename);
    res.send(content);
  }
}

function main() {
  printInfo();

  const app = express();

  // TODO: make normal later
  app.get('/', getFileLoader('./index.html'));
  app.get('/manifest.json', getFileLoader('./manifest.json'));
  app.get('/pwa_logo.jpg', getFileLoader('./pwa_logo.jpg'));

  availableCommands.forEach(command => setCommand(app, command));

  app.listen(port, () => console.log(`Started on port: ${port}`));
}

main();
