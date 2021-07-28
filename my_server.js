const express = require('express');
const request = require('request');
const expressStaticGzip = require("express-static-gzip");
const SocketIO = require('socket.io');

// Логирование
const LOG = true;

// -------------------------------------------------------------- //
// --------------< Настройка и запуск веб-сервера >-------------- //
// -------------------------------------------------------------- //

const port = process.env.PORT || 8080;

const app = express();
const server = require('http').createServer(app);


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  next();
});

app.use(express.json({ limit: '1mb' }));

// Устанавливаем корневую рендер-директорию
app.set('views',       'views' );
app.set('view engine', 'pug'   );

// Виртуализация сетевых директорий
app.use('/dist', expressStaticGzip(__dirname.concat('/dist')));
app.use('/assets', expressStaticGzip(__dirname.concat('/assets')));

// Игра "тегрика"
app.get("/tegrika/", (req, res) => {
  res.render("game");
});

// Прослушивание сервера
server.listen(port, function () {
  LOG && console.log('listening in http://localhost:' + port);
});

// -------------------------------------------------------------- //
// -------------</ Настройка и запуск веб-сервера >-------------- //
// -------------------------------------------------------------- //




// -------------------------------------------------------------- //
// ---< Определение типов и объявление глобальных переменных >--- //
// -------------------------------------------------------------- //

/**
 * Тип данных, содержащий информацию об игре
 * @typedef {Object} PlayRoomInfo
 * @property {SocketIO.Socket} overtake
 * @property {SocketIO.Socket} runaway
 * @property {number} start_time
 * @property {number} end_time
 */

/**
 * Так называемый "зал ожидания"
 * @type {Array<SocketIO.Socket>}
 */
let waiting_sockets = [];

// Длительность игры (мс)
const GAME_DURATION = 60 * 1000;

// Габариты объекта
const radius = 30;                    // Здесь задаём вручную
const diameter = radius * radius * 4; // Вычисляется автоматически

/** @type {SocketIO.Server} */
const io = SocketIO(server);


// -------------------------------------------------------------- //
// --</ Определение типов и объявление глобальных переменных >--- //
// -------------------------------------------------------------- //





// -------------------------------------------------------------- //
// --------------------< Утилитные функции >--------------------- //
// -------------------------------------------------------------- //

function rand() {
  return Math.random().toString(36).substr(2); // remove `0.`
};

function getRandomString() {
  return rand() + rand(); // to make it longer
};

// -------------------------------------------------------------- //
// --------------------</ Утилитные функции >-------------------- //
// -------------------------------------------------------------- //






// -------------------------------------------------------------- //
// -----------------< Запуск веб-сокет сервера >----------------- //
// -------------------------------------------------------------- //

io.on('connection', /** @param {SocketIO.Socket} socket */ (socket) => {

  // Подключение нового пользователя, когда он открыл игру
  socket.on('authorization', () => {
    LOG && console.log(`Connected socket ${socket.id}`);
    socket.emit('authorization', { msg: 'success', description: 'Успешная авторизация' });
  });


  // Отсоединение пользователя
  socket.on('disconnect', () => {
    // Пока пусто
  });

  // Событие поиска соперника
  socket.on('find-me-an-opponent', data => {
    // Логирование
    LOG && console.log(`Socket ${socket.id} is waiting opponent`);

    // Отправляем статус поиска
    socket.emit('find-me-an-opponent', { msg: 'success'});

    // Проверяем наличие других ожидающих игроков
    if (!waiting_sockets.length) {

      // Пусто => добавляем игрока в массив ожидания
      waiting_sockets.push(socket);
      
      // Теперь нужно ждать, когда появится соперник. Ответ придёт в start-playing
      return ;
    }

    // Есть ожидающие => берём одного из них
    const [otherSocket] = waiting_sockets.splice(0, 1);
    
    // Создаём комнату
    room_name = getRandomString();

    let sockets = [socket, otherSocket];
    sockets.forEach(v => v.join(room_name));

    // Случайным образом определяем роли
    if (Math.random() > .5)
      sockets = [otherSocket, socket];

    /**
     * Этот объект будет содержать всю необходимую информацию об игре
     * @type {PlayRoomInfo}
     */
    const playRoomInfo = ({
      overtake: sockets[0],
      runaway:  sockets[1],
      start_time: Date.now() + 3000,
      end_time: GAME_DURATION
    });

    playRoomInfo.end_time += playRoomInfo.start_time;

    // Отправляем событие о начале игры каждому сокету
    sockets.forEach((v, i) => v.emit("start-playing", {
      role: (i ? "overtake" : "runaway"),
      start_time: playRoomInfo.start_time,
      end_time:   playRoomInfo.end_time
    }));

    // Событие отправки координат
    sockets.forEach((socket, i) => {
      // Заранее определяем сокет оппонента
      const opponentSocket = sockets[1 - i];

      socket.on('update-coordinates', /** @param {Buffer} coords */(coords) => {
        // Отправляем координаты сопернику
        opponentSocket.emit('coordinates-opponent', [0, 0].map((v, i) => coords.readFloatLE(i * 4)));
      });
    });
  });
});

// -------------------------------------------------------------- //
// ----------------</ Запуск веб-сокет сервера >----------------- //
// -------------------------------------------------------------- //