import { hash } from 'bcryptjs';
import User from '../models/User';
import AppError from '../../errors/AppError';

export default {
  async store(req, res) {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      throw new AppError('Email address already used');
    }

    const passwordHash = await hash(password, 8);

    let user = await User.create({
      name,
      email,
      password: passwordHash,
    });

    user = user.toJSON();

    delete user.password;

    return res.json(user);
  },
};
