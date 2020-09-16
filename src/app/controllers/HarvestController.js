import AppError from '../../errors/AppError';
import Harvest from '../models/Harvest';
import Mill from '../models/Mill';

export default {
  async store(req, res) {
    const { start_date, end_date, mill_id } = req.body;

    const mill = await Mill.findByPk(mill_id);

    if (!mill) {
      throw new AppError("Mill doesn't exist");
    }

    if (req.user_id !== mill.user_id) {
      throw new AppError("User doesn't have permission", 401);
    }

    const harvest = await Harvest.create({
      start_date,
      end_date,
      mill_id,
    });

    return res.json(harvest);
  },
  async index(req, res) {
    const harvests = await Harvest.findAll({
      include: { association: 'farms' },
    });

    return res.json(harvests);
  },

  async update(req, res) {
    const { start_date, end_date, mill_id } = req.body;
    const { harvest_id } = req.params;

    const harvest = await Harvest.findByPk(harvest_id, {
      include: { association: 'mill' },
    });

    if (!harvest) {
      throw new AppError("Harvest doesn't  exist", 401);
    }

    if (harvest.mill.user_id !== req.user_id) {
      throw new AppError("User doesn't have permission", 401);
    }

    if (mill_id) {
      const mill = await Mill.findByPk(mill_id);

      if (mill.user_id !== req.user_id) {
        throw new AppError("User doesn't have permission");
      }
    }

    await harvest.update({ start_date, end_date, mill_id });

    return res.json(harvest);
  },

  async delete(req, res) {
    const { harvest_id } = req.params;

    const harvest = await Harvest.findByPk(harvest_id, {
      include: { association: 'mill' },
    });

    if (!harvest) {
      throw new AppError("Harvest doesn't  exist", 401);
    }

    if (harvest.mill.user_id !== req.user_id) {
      throw new AppError("User doesn't have permission", 401);
    }

    await harvest.destroy();

    return res.send();
  },
};
