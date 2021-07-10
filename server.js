const express = require('express');
const request = require('request');
const expressStaticGzip = require("express-static-gzip");

const app = express();
const server = require('http').createServer(app);

var port = process.env.PORT || 8080;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  next();
});

app.use(express.json({ limit: '1mb' }));


// Устанавливаем корневую рендер-директорию
// И "pug" как основной рендерер
app.set('views',       'views' );
app.set('view engine', 'pug');

// Виртуализация сетевых директорий
app.use('/dist', expressStaticGzip(__dirname.concat('/dist')));


app.get("/tegrika/", (req, res) => {
  res.render("game");
});

server.listen(port, function () {
  console.log('listening in http://localhost:' + port);
});