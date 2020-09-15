import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';
import AppError from '../../errors/AppError';
import auth from '../../config/auth';

export default {
  async store(req, res) {
    const { email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (!userExists) {
      throw new AppError("User doesn't exist");
    }

    const passwordMatches = await compare(password, userExists.password);

    if (!passwordMatches) {
      throw new AppError("User doesn't exist");
    }

    const user = userExists.toJSON();

    delete user.password;

    const token = sign({}, auth.jwt.secret, {
      subject: user.id,
      expiresIn: auth.jwt.expiresIn,
    });

    return res.json({ user, token });
  },
};
