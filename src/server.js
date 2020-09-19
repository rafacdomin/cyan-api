import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import cors from 'cors';
import 'express-async-errors';

import Routes from './routes';
import AppError from './errors/AppError';

import './database';

const app = express();
const server = http.Server(app);
const io = socketIO(server);

io.on('connect', socket =>
  console.log(`Client connected: ${socket.handshake.query.platform}`),
);

app.use((req, res, next) => {
  req.io = io;

  return next();
});

app.use((err, req, res, _) => {
  if (err instanceof AppError) {
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

app.use(cors());
app.use(express.json());
app.use(Routes);

server.listen(3333, () => {
  console.log('Server started on port 3333');
});
