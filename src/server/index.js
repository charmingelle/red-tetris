const express = require('express');
const app = express();
const post = 5000;
const http = app.listen(post, () =>
  console.log(`Server is running on port ${5000}`),
);
const Connection = require('./classes/Connection');

new Connection(require('socket.io')(http));
