const robot = require("robotjs");
const express = require('express');
const fs = require('fs');
const os = require('os');
const readline = require('readline');

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

function getFileLoader(filename, contentType) {
  return async function(req, res) {
    const content = await readFileAsync(filename);
    res.set('Content-Type', contentType);
    res.status(200);
    res.send(content);
  }
}

function startExpressVersion() {
  printInfo();

  const app = express();

  // TODO: make normal later
  app.get('/', getFileLoader('./index.html', 'text/html'));
  app.get('/manifest.json', getFileLoader('./manifest.json', 'application/manifest+json'));
  app.get('/pwa_logo.jpg', getFileLoader('./pwa_logo.jpg', 'image/jpg'));
  app.get('/sw.js', getFileLoader('./sw.js', 'application/javascript'));

  availableCommands.forEach(command => setCommand(app, command));

  app.listen(port, () => console.log(`Started on port: ${port}`));
}

function startTelegramVersion() {
  console.log('Not implemented');
}

function getUserInput(question) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  }); 
}

async function main() {
  const answer = await getUserInput('1 - telegram mode, 2 - web mode:\n');

  const answeerToHandlers = {
    '1': startTelegramVersion,
    '2': startExpressVersion,
  };

  const handler = answeerToHandlers[answer];
  if (!handler) {
    console.log('Incorrect input');
    return;
  }

  handler();
}

main();
