'use strict';

const express = require('express');
const APP_PORT = process.env.APP_PORT;
const app = express();

app.get('/', function (req, res) {
  res.send('Hello world\n');
});

var server = app.listen(APP_PORT, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
