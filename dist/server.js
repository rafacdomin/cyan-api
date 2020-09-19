"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _http = require('http'); var _http2 = _interopRequireDefault(_http);
var _socketio = require('socket.io'); var _socketio2 = _interopRequireDefault(_socketio);
var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);
require('express-async-errors');

var _routes = require('./routes'); var _routes2 = _interopRequireDefault(_routes);
var _AppError = require('./errors/AppError'); var _AppError2 = _interopRequireDefault(_AppError);

require('./database');

const app = _express2.default.call(void 0, );
const server = _http2.default.Server(app);
const io = _socketio2.default.call(void 0, server);

io.on('connect', socket =>
  console.log(`Client connected: ${socket.handshake.query.platform}`),
);

app.use((req, res, next) => {
  req.io = io;

  return next();
});

app.use((err, req, res, _) => {
  if (err instanceof _AppError2.default) {
    res.status(err.statusCode).json({
      status: 'err',
      message: err.message,
    });
  }

  console.log(err);

  return res.status(500).json({
    status: 'err',
    message: 'Internal server error',
  });
});

app.use(_cors2.default.call(void 0, ));
app.use(_express2.default.json());
app.use(_routes2.default);

server.listen(3333, () => {
  console.log('Server started on port 3333');
});
