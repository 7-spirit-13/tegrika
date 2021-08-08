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
 * 
 * @property {SocketIO.Socket} overtake
 * @property {SocketIO.Socket} runaway
 * @property {number}          start_time
 * @property {number}          end_time
 * @property {number}          last_touching_check_time
 * @property {number}          touching_time
 * @property {Array<number>}   coordinates
 */

/**
 * Так называемый "зал ожидания"
 * @type {Array<SocketIO.Socket>}
 */
let waiting_sockets = [];

// Длительность игры (мс)
const GAME_DURATION = 60 * 1000;
const MAP_WIDTH = 375;
const MAP_HEIGHT = 667;

// Габариты объекта
const radius = 30;                    // Здесь задаём вручную
const diameter_2 = radius * radius * 4; // Вычисляется автоматически

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
    let i = waiting_sockets.indexOf(socket);
    if (i !== -1) waiting_sockets.splice(i, 1);
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

    // Случайным образом определяем роли
    if (Math.random() > .5)
      sockets = [otherSocket, socket];

    /**
     * Этот объект будет содержать всю необходимую информацию об игре
     * @type {PlayRoomInfo}
     */
    const playRoomInfo = ({
      overtake: sockets[0],               // Socket with overtake player
      runaway:  sockets[1],               // Socket with runaway  player
      start_time: Date.now() + 3000,      // Game started time
      end_time: GAME_DURATION,            // Time when game will be ended
      last_touching_check_time: 0,        // Last checking of touching time
      touching_time: 0,                   // Total touching time

      coordinates: [
        MAP_WIDTH  / 2 - 70,    // runaway  x
       -MAP_HEIGHT / 2 + 70,    // runaway  y
       -MAP_WIDTH  / 2 + 70,    // overtake x
        MAP_HEIGHT / 2 - 70     // overtake y
      ]
    });

    playRoomInfo.end_time += playRoomInfo.start_time;
    playRoomInfo.last_touching_check_time = playRoomInfo.start_time;

    // Отправляем событие о начале игры каждому сокету
    sockets.forEach((v, i) => v.emit("start-playing", {
      role: (i ? "overtake" : "runaway"),
      start_time: playRoomInfo.start_time,
      end_time:   playRoomInfo.end_time,
      server_utc: Date.now()
    }));

    function checkTouching() {
      const c = playRoomInfo.coordinates;
      const distance = Math.pow(c[0] - c[2], 2) + Math.pow(c[1] - c[3], 2);
      const deltaTime = Date.now() - playRoomInfo.last_touching_check_time;

      playRoomInfo.last_touching_check_time += deltaTime;

      if (distance < diameter_2) {
        playRoomInfo.touching_time += deltaTime;
        return true;
      }

      return false;
    }

    let touchingTimeoutID = null;
    let killers = [];

    // Событие отправки координат
    sockets.forEach((socket, i) => {
      // Заранее определяем сокет оппонента
      const opponentSocket = sockets[1 - i];

      // Колл-бэк
      const onUpdateCoords = /** @param {Buffer} coords */(coords) => {
        let opponentCoords = [0, 0].map((v, i) => coords.readFloatLE(i * 4));

        // Отправляем координаты сопернику
        opponentSocket.emit('coordinates-opponent', opponentCoords);

        playRoomInfo.coordinates.splice(i * 2, 2, ...opponentCoords);

        if (checkTouching()) {
          // Отправляем игрокам новое время касания
          sockets.forEach(v => v.emit('update-touching-time', playRoomInfo.touching_time));

          if (playRoomInfo.touching_time > 5000) {
            endGame("overtake");
          } else if (touchingTimeoutID === null) {
            touchingTimeoutID = setTimeout(() => endGame("overtake"), 5000 - playRoomInfo.touching_time);
          }
        } else if (touchingTimeoutID !== null) {
          clearTimeout(touchingTimeoutID);
          touchingTimeoutID = null;
        }
      };

      setTimeout(() => {
        socket.on('update-coordinates', onUpdateCoords);
        killers.push(() => socket.off('update-coordinates', onUpdateCoords));
      }, playRoomInfo.start_time - Date.now());
    });

    let timeoutID = setTimeout(() => endGame("runaway"), playRoomInfo.end_time - Date.now());

    function endGame(winner) {
      clearTimeout(timeoutID);
      if (touchingTimeoutID !== null) clearTimeout(touchingTimeoutID);
      killers.forEach(v => v());
      sockets.forEach(v => v.emit('end-game', winner));
    }
  });
});

// -------------------------------------------------------------- //
// ----------------</ Запуск веб-сокет сервера >----------------- //
// -------------------------------------------------------------- //