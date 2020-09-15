import express from 'express';
import cors from 'cors';
import 'express-async-errors';

import Routes from './routes';
import AppError from './errors/AppError';

import './database';

const server = express();

server.use(cors());
server.use(express.json());
server.use(Routes);

server.use((err, req, res, _) => {
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

server.listen(3333, () => {
  console.log('Server started on port 3333');
});
