const robot = require("robotjs");
const express = require('express');
const fs = require('fs');

const port = 3000;
const app = express();

app.get('/', (req, res) => {
  const content = fs.readFileSync('./index.html').toString();
  res.send(content);
});

function setCommand(command) {
  app.post(`/commands/${command}`, (req, res) => {
    robot.keyTap(command);
    res.send({ ok: true });
  });
}

setCommand('audio_mute');
setCommand('audio_play');
setCommand('audio_pause');
setCommand('audio_prev');
setCommand('audio_next');
setCommand('audio_vol_down');
setCommand('audio_vol_up');

app.listen(port, () =>console.log(`Started on port: ${port}`));
