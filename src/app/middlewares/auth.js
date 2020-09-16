import { verify } from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';
import AppError from '../../errors/AppError';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token not provided', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decode = await promisify(verify)(token, authConfig.jwt.secret);

    req.user_id = decode.sub;
  } catch (err) {
    throw new AppError('Token invalid', 401);
  }

  return next();
};
