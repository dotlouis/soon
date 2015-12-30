'use strict';

const express = require('express');
const APP_PORT = process.env.APP_PORT;
const app = express();

app.get('/', function (req, res) {
  res.send('Hello world\n');
});

app.listen(APP_PORT);
console.log('Running on http://localhost:' + APP_PORT);
