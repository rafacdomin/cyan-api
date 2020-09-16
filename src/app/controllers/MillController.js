import AppError from '../../errors/AppError';
import Mill from '../models/Mill';
import User from '../models/User';

export default {
  async store(req, res) {
    const { name } = req.body;

    const user = await User.findByPk(req.user_id);

    if (!user) {
      throw new AppError("User doesn't exist");
    }

    const mill = await Mill.create({
      name,
      user_id: req.user_id,
    });

    return res.json(mill);
  },

  async index(req, res) {
    const mills = await Mill.findAll({
      include: { association: 'harvests', include: { association: 'farms' } },
    });

    return res.json(mills);
  },

  async update(req, res) {
    const { name } = req.body;
    const { mill_id } = req.params;

    const mill = await Mill.findByPk(mill_id);

    if (!mill) {
      throw new AppError("Mill doesn't  exist", 401);
    }

    if (mill.user_id !== req.user_id) {
      throw new AppError("User don't have permission", 401);
    }

    await mill.update({ name });

    return res.json(mill);
  },

  async delete(req, res) {
    const { mill_id } = req.params;

    const mill = await Mill.findByPk(mill_id);

    if (!mill) {
      throw new AppError("Mill doesn't  exist", 401);
    }

    if (mill.user_id !== req.user_id) {
      throw new AppError("User doesn't have permission", 401);
    }

    await mill.destroy();

    return res.send();
  },
};
