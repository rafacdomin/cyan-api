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
      throw new AppError("Farm doesn't exist");
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
    const fields = await Field.findAll({
      include: {
        association: 'farm',
        include: { association: 'harvest', include: { association: 'mill' } },
      },
    });

    return res.json(fields);
  },

  async update(req, res) {
    const { latitude, longitude, farm_id } = req.body;
    const { field_id } = req.params;

    const field = await Field.findByPk(field_id, {
      include: {
        association: 'farm',
        include: { association: 'harvest', include: { association: 'mill' } },
      },
    });

    if (!field) {
      throw new AppError("Field doesn't  exist", 401);
    }

    if (field.farm.harvest.mill.user_id !== req.user_id) {
      throw new AppError("User doesn't have permission", 401);
    }

    if (farm_id) {
      const farm = await Farm.findByPk(farm_id, {
        include: { association: 'harvest', include: { association: 'mill' } },
      });

      if (farm.harvest.mill.user_id !== req.user_id) {
        throw new AppError("User doesn't have permission");
      }
    }

    await field.update({
      farm_id,
      geography: { type: 'Point', coordinates: [latitude, longitude] },
    });

    return res.json(field);
  },

  async delete(req, res) {
    const { field_id } = req.params;

    const field = await Field.findByPk(field_id, {
      include: {
        association: 'farm',
        include: { association: 'harvest', include: { association: 'mill' } },
      },
    });

    if (!field) {
      throw new AppError("Field doesn't  exist", 401);
    }

    if (field.farm.harvest.mill.user_id !== req.user_id) {
      throw new AppError("User doesn't have permission", 401);
    }

    await field.destroy();

    return res.send();
  },
};
