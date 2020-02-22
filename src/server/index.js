const express = require('express');
const app = express();
const path = require('path');
const post = 5000;
const http = app.listen(post, () =>
  console.log(`Server is running on port ${5000}`),
);

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const Connection = require('./classes/Connection');

new Connection(require('socket.io')(http));
