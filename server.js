//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

/*
 * DB
 */
var mongoose = require('mongoose');
var configDB = require('./config/database.js');
var db = mongoose.connect(configDB.url);

/*
 * express
 */
var router = express();
router.set('views', path.join(__dirname, 'app/views'));
router.engine('html', require('ejs').renderFile);
router.set('view engine', 'html');
router.set('port', process.env.PORT || 3000);
router.set('secretKey', configDB.secret);
router.set('cookieSessionKey', 'sid');
router.use(express.json());
router.use(express.urlencoded());
//app.use(express.bodyParser());
//router.use(express.bodyParser({uploadDir:'./app/userImage'}));
router.use(express.methodOverride());
router.use(express.cookieParser(router.get('secretKey')));

var server = http.createServer(router);
var io = socketio.listen(server);
router.use(express.static(path.resolve(__dirname, 'app')));

/*
 * セッション管理
 */
var Session = express.session.Session;
var MongoStore = require('connect-mongo')(express);
var sessionStore = new MongoStore({
        mongoose_connection : db.connections[0],
        clear_interval: 60 * 60// Interval in seconds to clear expired sessions. 60 * 60 = 1 hour
});
router.use(express.session({
    //cookieにexpressのsessionIDを保存する際のキーを設定
    key : router.get('cookieSessionKey'),
    secret: configDB.secret,
    store: sessionStore,
    cookie: {
        httpOnly: false,
        // 60 * 60 * 1000 = 3600000 msec = 1 hour
        //maxAge: new Date(Date.now() + 60 * 60 * 1000),
    }
}));

//-----------------------------------------------------------------------------
//login
//-----------------------------------------------------------------------------
var auth = require('./api/login');
router.post('/api/login', auth.login);
router.post('/api/isLogin', auth.isLogin);
var routes = require('./routes');
router.get('/login', routes.login);

//-----------------------------------------------------------------------------
//main
//-----------------------------------------------------------------------------
var main = require('./api/main');
router.post('/api/mine', main.getMine);
var task = require('./api/task');
router.post('/api/card', task.addTask);
router.post('/api/card/remove', task.removeTask);
router.post('/api/card/changeProgress', task.changeProgress);
router.post('/api/card/getComment', task.getComment);
router.post('/api/card/addComment', task.addComment);


var messages = [];
var sockets = [];

io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });

    socket.on('message', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text
        };

        broadcast('message', data);
        messages.push(data);
      });
    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        updateRoster();
      });
    });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
