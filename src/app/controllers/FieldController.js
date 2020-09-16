import AppError from '../../errors/AppError';
import Farm from '../models/Farm';
import Field from '../models/Field';

export default {
  async store(req, res) {
    const { latitude, longitude, farm_id } = req.body;

    const farm = await Farm.findByPk(farm_id, {
      include: { association: 'harvest', include: { association: 'mill' } },
    });

    if (!farm) {
      throw new AppError("Harvest doesn't exist");
    }

    if (req.user_id !== farm.harvest.mill.user_id) {
      throw new AppError("User doesn't have permission", 401);
    }

    const field = await Field.create({
      geography: { type: 'Point', coordinates: [latitude, longitude] },
      farm_id,
    });

    return res.json(field);
  },
  async index(req, res) {
    const farms = await Farm.findAll();

    return res.json(farms);
  },

  async update(req, res) {
    const { name, harvest_id } = req.body;
    const { farm_id } = req.params;

    const farm = await Farm.findByPk(farm_id, {
      include: { association: 'harvest', include: { association: 'mill' } },
    });

    if (!farm) {
      throw new AppError("Harvest doesn't  exist", 401);
    }

    if (farm.harvest.mill.user_id !== req.user_id) {
      throw new AppError("User doesn't have permission", 401);
    }

    if (harvest_id) {
      const harvest = await Harvest.findByPk(harvest_id, {
        include: { association: 'mill' },
      });

      if (harvest.mill.user_id !== req.user_id) {
        throw new AppError("User doesn't have permission");
      }
    }

    await farm.update({ name, harvest_id });

    return res.json(farm);
  },

  async delete(req, res) {
    const { farm_id } = req.params;

    const farm = await Farm.findByPk(farm_id, {
      include: { association: 'harvest', include: { association: 'mill' } },
    });

    if (!farm) {
      throw new AppError("Farm doesn't  exist", 401);
    }

    if (farm.harvest.mill.user_id !== req.user_id) {
      throw new AppError("User doesn't have permission", 401);
    }

    await farm.destroy();

    return res.send();
  },
};
