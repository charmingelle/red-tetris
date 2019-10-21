const express = require('express');
const app = express();
const post = 5000;

app.get('/users', (req, res) => res.json('Hi!'));

app.listen(post, () => console.log(`Server is running on port ${5000}`));
