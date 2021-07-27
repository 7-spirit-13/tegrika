const express = require('express');
const request = require('request');
const expressStaticGzip = require("express-static-gzip");

const app = express();
const server = require('http').createServer(app);

io = require('socket.io')(server);

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
app.set('view engine', 'pug'   );

// Виртуализация сетевых директорий
app.use('/dist', expressStaticGzip(__dirname.concat('/dist')));
app.use('/assets', expressStaticGzip(__dirname.concat('/assets')));


app.get("/tegrika/", (req, res) => {
  res.render("game");
});

server.listen(port, function () {
  console.log('listening in http://localhost:' + port);
});

// Удаление элмента массива со сдвигом
function remove(arr, indexes) {
  var arrayOfIndexes = [].slice.call(arguments, 1);
  return arr.filter(function (item, index) {
    return arrayOfIndexes.indexOf(index) == -1;
  });
}

// Исскуственная задержка (пауза) в работе скрипта
function sleepFor( sleepDuration ){
  var now = new Date().getTime();
  while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}

var rand = function() {
  return Math.random().toString(36).substr(2); // remove `0.`
};

var token = function() {
  return rand() + rand(); // to make it longer
};

users = [] // Пользователи, которые запустили игровой процесс и ожидают соперника
// Вот, что внутри: 
// [
//   {
//     id: '',
//     status: ''
//   }
// ]

radius = 60; // радиус фигурок в пикселях на клиенте

scope = [] // здесь будут комнаты, в которых играют игроки.

// СТАРТ СТАР СТАРТ СТАРТ СТАР СТАРТ СТАРТ СТАР СТАРТ СТАРТ СТАР СТАРТ
// Запустим поиск соперника через секунду после запуска сервера
setTimeout(() => { search_rivals() }, 1000)
// СТАРТ СТАР СТАРТ СТАРТ СТАР СТАРТ СТАРТ СТАР СТАРТ СТАРТ СТАР СТАРТ


async function creating_room(id_user_1, id_user_2){
  // Создание игровой комнаты
  let id_room = token(); // "bnh5yzdirjinqaorq0ox1tf383nb3xr"
  scope.push({
    id_room: id_room, // идетификатор комнаты
    date: new Date().getTime(), // время создания игровой комнаты.
    contact: 0, // соприкосновения. Если 5000, игра завершается
    // Игрок, который догоняет
    users: [
      {
        rool: 'overtake', // Игрок, который догоняет
        id: id_user_2,
        coordinates: [] // история перемещений игрока
      },
      {
        rool: 'runaway', // Игрок, который убегает
        id: id_user_1,
        coordinates: [] // история перемещений игрока
      }
    ]
  }) 
  console.log('\nКОМНАТА СОЗДАНА.\nid_room: '+id_room+'\nid_user_1: '+id_user_1+'\nid_user_2: '+id_user_2+'\n')
  // Время, во сколько начинаем игру
  let time_to_start = new Date()
  let secund = 3
  // Добавляем + 3 секунды к текущему времени - ровно в это время игра должна запуститься
  time_to_start.setDate(time_to_start.getSeconds() + secund)
  // Всё готово для игры, отправляю инфу обоим игрокам
  io.sockets.in(id_user_1).emit('start-playing', { id_room: id_room, role: 'runaway', time_to_start: time_to_start, text: 'Всё готов для игры. Ваша задача УБЕГАТЬ.\nИгра начнётся через '+secund+' секунды' }) // убегающий
  io.sockets.in(id_user_2).emit('start-playing', { id_room: id_room, role: 'overtake', time_to_start: time_to_start, text: 'Всё готов для игры. Ваша задача ДОГОНЯТЬ соперника.\nИгра начнётся через '+secund+' секунды' }) // догоняющий
}

var user_one = '' // сюда запишем первого пользоватея

function search_rivals() {
  // Поиск соперников
  
    for(let i = 0; i < users.length; i++){
      if(users[i].status == 'search'){
        if(user_one == ''){
          users[i].status = 'waiting'
          user_one = users[i].id
          continue
        } else {

            users[i].status = 'playing'
            let successfully_found = false // проверяем, не вышел ли пользователь, который уже находится в ожидании
            for(let j = 0; j < users.length; j++){
              if(user_one == users[j].id) {
                users[j].status = 'playing'
                successfully_found = true
                break
              }
            }
            if(successfully_found == false){
              // не нашли пользователя, который был в ожидании, удалим его, точнее перезапишем
              user_one = users[i].id
              continue
            } else {
              creating_room(user_one, users[i].id)
              user_one = ''
            }

        }
      }
    }

  // Вызываю эту функцию повторно 
  setTimeout(() => {
    search_rivals();
  }, 80);
}

// ИГРОВОЙ ПРОЦЕСС ИГРОВОЙ ПРОЦЕСС ИГРОВОЙ ПРОЦЕСС ИГРОВОЙ ПРОЦЕСС ИГРОВОЙ ПРОЦЕСС
// ИГРОВОЙ ПРОЦЕСС ИГРОВОЙ ПРОЦЕСС ИГРОВОЙ ПРОЦЕСС ИГРОВОЙ ПРОЦЕСС ИГРОВОЙ ПРОЦЕСС
function check_contact(id_room) {
  for(let i = 0; i < scope.length; i++) {
    if(scope[i].id_room == id_room){
      // Получаем последние известные координаты, полученные от игроков
      X_user1 = scope[i].users[0].coordinates[scope[i].users[0].coordinates.length - 1].x
      Y_user1 = scope[i].users[0].coordinates[scope[i].users[0].coordinates.length - 1].y
      X_user2 = scope[i].users[1].coordinates[scope[i].users[0].coordinates.length - 1].x
      Y_user2 = scope[i].users[1].coordinates[scope[i].users[0].coordinates.length - 1].y
      distance_between_objects = Math.sqrt(X_user1 * X_user2 + Y_user1 * Y_user2)
      if(radius * 2 > distance_between_objects){
        // Соприкосновение
        console.log('Соприкосновение в комнате №'+id_room) 
        scope[i].contact += 10 // добавляю 10 миллисикунд, если контакт устанолвен. 
        // Если наберётся 5000, стоп игра
        if(scope[i].contact >= 5000){
          io.sockets.in(scope[i].users[0].id).emit('stop-playing', { event: 'goal_achieved' })
          io.sockets.in(scope[i].users[1].id).emit('stop-playing', { event: 'goal_achieved' })
          // Через минуту удалим комнату. Комнаты могли измениться, потому выполним поиск ещё раз
          setTimeout(() => { 
            for(let k = 0; k < scope.length; k++) {
              if(scope[k].id_room == id_room){
                scope = remove(scope, k)
              }
            }
          }, 60000)
        }
        // ВНИМАНИЕ! Нет проверки на TimeOut!!! Допишу чуть попозже. Думаю вешать таймер, который буду обнулять досрочно, либо останавливать игру.
      } else {
        // Не соприкосаются
      }
      return
    }
  }
}


// ИГРОВОЙ ПРОЦЕСС ИГРОВОЙ ПРОЦЕСС ИГРОВОЙ ПРОЦЕСС ИГРОВОЙ ПРОЦЕСС ИГРОВОЙ ПРОЦЕСС
// ИГРОВОЙ ПРОЦЕСС ИГРОВОЙ ПРОЦЕСС ИГРОВОЙ ПРОЦЕСС ИГРОВОЙ ПРОЦЕСС ИГРОВОЙ ПРОЦЕСС

io.on('connection', socket => {

  socket.join(socket.handshake.sessionID);

  socket.on('authorization', user_id => {
    // Подключение нового пользователя. Когда он открыл игру
    console.log('Подключился игрок с id: ', socket.id)
    users.push({ id: [socket.id], status: '' })
    return socket.emit('authorization', { msg: 'success', id: socket.id, text: 'Успешная авторизация' })
    // Получив ответ нужно вызвать find-me-an-opponent
  })

  // Отсоединение пользователя
  socket.on('disconnect', () => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].id == socket.id) {
        console.log('Игрок с id: ', socket.id, ' покинул игру')
        users = remove(users, i)
        // Если этот игрок был в игре, то закроем игру досрочно
        for(let j = 0; j < scope.length; j++){
          if(scope[j].users[0].id == socket.id || scope[j].users[1].id == socket.id){
            let recipient = ''
            if(scope[j].users[1].id == socket.id)
              recipient = scope[j].users[0].id
            else
              recipient = scope[j].users[1].id
            console.log('Удаляю комнату id:'+scope[j].id_room+', соперник вышел')
            io.sockets.in(recipient).emit('stop-playing', { event: 'rival_left', text: 'Соперник покинул игру' })
            // Удаляю комнату
            scope = remove(scope, j)
          }
        }
      }
    }
  })

  socket.on('find-me-an-opponent', data => {
    // Здесь обозначаем статус, что игрок в поиске соперника.
    console.log('Игрок id:'+socket.id+' в поиске соперника', )
    for(let i = 0; i < users.length; i++){
      if(socket.id == users[i].id) {
        users[i].status = 'search'
        break
      }
    }
    return socket.emit('find-me-an-opponent', { msg: 'success', text: 'Вы зашли в игру, теперь ожидаем подключения соперника' })
    // Теперь нужно ждать, когда появится соперник. Ответ придёт в start-playing
  })

  socket.on('send-coordinates-here', data => {
    // Получение местоположения игроков
    let id_opponent = ''
    // Сюда передать id_room, x, y
    for(let i = 0; i < data.length; i++){
      if(scope[i].id_room == data.id_room){
        if(scope[i].users[0].id == socket.id){
          scope[i].users[0].coordinates.push({ x : data.x, y : data.y})
          id_opponent = scope[i].users[1].id
        }
        scope[i].users[1].coordinates.push({ x : data.x, y : data.y})
        id_opponent = scope[i].users[0].id
      }
    }
    // отправляем координаты сопернику
    socket.broadcast.to(id_opponent).emit('coordinates-opponent', { x : data.x, y : data.y})
    check_contact(data.id_room)
  })

})