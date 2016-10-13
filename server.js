var express = require('express');
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-authentication'));

var app = express();

var ENV = process.env.NODE_ENV || 'development';
var clientDir = __dirname + '/client';

app.set('view engine', 'ejs');

var devMode = ENV === 'development';

// setup reload server
if (devMode) {
  console.log('DEV: starting livereload');
  var livereload = require('livereload');
  var reloadServer = livereload.createServer();
  reloadServer.watch(clientDir);
}

app.use(express.static(clientDir));

app.get('/*', function(req, res) {
  console.log('got request');
  res.render(clientDir + '/index', { dev: devMode });
});

app.listen(80, '0.0.0.0');