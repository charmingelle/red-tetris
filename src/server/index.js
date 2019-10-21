const express = require('express');
const app = express();
const post = 5000;
const http = app.listen(post, () =>
  console.log(`Server is running on port ${5000}`),
);
const io = require('socket.io')(http);

app.get('/users', (req, res) => res.json('Hi!'));

io.use((socket, next) => {
  console.log(socket.id, socket.request._query.login);
  next();
});
