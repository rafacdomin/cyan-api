import { validate } from 'uuid';
import AppError from '../../errors/AppError';
import Farm from '../models/Farm';
import Field from '../models/Field';
import Harvest from '../models/Harvest';
import Mill from '../models/Mill';

export default {
  async store(req, res) {
    const {
      latitude,
      longitude,
      farm,
      harvest,
      start_date,
      end_date,
      mill,
    } = req.body;
    const { user_id } = req;

    // Mill validation

    let newMill = await Mill.findOne({ where: { name: mill, user_id } });

    if (validate(mill)) {
      newMill = await Mill.findByPk(mill);

      if (newMill && newMill.user_id !== user_id) {
        throw new AppError('User unathourized', 401);
      }
    }

    if (!newMill) {
      try {
        newMill = await Mill.create({ name: mill, user_id });
      } catch (err) {
        throw new AppError('Name must be unique');
      }
    }

    // Harvest Validation

    let newHarvest = Harvest.build({
      start_date,
      end_date,
      mill_id: newMill.id,
    });

    if (harvest) {
      newHarvest = await Harvest.findByPk(harvest, {
        include: { association: 'mill' },
      });

      if (newHarvest && newHarvest.mill.user_id !== user_id) {
        throw new AppError('User unathourized', 401);
      }

      if (!newHarvest) {
        newHarvest = await Harvest.create({
          start_date,
          end_date,
          mill_id: newMill.id,
        });
      }
    } else {
      await newHarvest.save();
    }

    // Farm Validation

    let newFarm = await Farm.findOne({
      where: { name: farm },
      include: {
        association: 'harvest',
        include: { association: 'mill' },
      },
    });

    if (newFarm && newFarm.harvest.mill.user_id !== user_id) {
      newFarm = null;
    }

    if (validate(farm)) {
      newFarm = await Farm.findByPk(farm, {
        include: {
          association: 'harvest',
          include: { association: 'mill' },
        },
      });

      if (newFarm && newFarm.harvest.mill.user_id !== user_id) {
        throw new AppError('User unathourized', 401);
      }
    }

    if (!newFarm) {
      newFarm = await Farm.create({ name: farm, harvest_id: newHarvest.id });
    }

    // Field Validation

    const newField = Field.build({
      geography: { type: 'Point', coordinates: [latitude, longitude] },
      farm_id: newFarm.id,
    });

    try {
      await newField.save();
    } catch (err) {
      throw new AppError('Latitude and Longitude must be unique');
    }

    return res.json(newField);
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
