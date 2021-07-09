var express = require('express');
var app = express();
var server = require('http').createServer(app);
var request = require('request');

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
  next()
})

app.use(express.json({ limit: '1mb' }));

var port = process.env.PORT || 8080;

server.listen(port, function () {
  console.log('listening in http://localhost:' + port);
});

app.get('/', function (req, res) {
  res.send('{"msg":"Hello, world!"}');
});

app.get('/.well-known/acme-challenge/UDmm6rNc7v7XCH8kmuSTr8JzOqnu1Oaq2pdaUyZNN5E', (req, res) => {
  res.send("UDmm6rNc7v7XCH8kmuSTr8JzOqnu1Oaq2pdaUyZNN5E.O5UUz0SUGjmeRoBAJ2FO418-xjaBRtky05eNS-jnsvI");
})