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
    const { mill, farm, field, harvest, start_date, end_date } = req.query;

    const fields = await Field.findAll({
      include: {
        association: 'farm',
        include: { association: 'harvest', include: { association: 'mill' } },
      },
    });

    const filteredFields = fields
      .filter(element => {
        if (validate(field)) {
          return element.id === field;
        }
        return element;
      })
      .filter(element => {
        if (farm) {
          if (validate(farm)) {
            return element.farm.id === farm;
          }

          return element.farm.name === farm;
        }

        return element;
      })
      .filter(element => {
        if (start_date) {
          if (end_date) {
            return (
              element.farm.harvest.end_date === end_date &&
              element.farm.harvest.start_date === start_date
            );
          }
          return element.farm.harvest.start_date === start_date;
        }
        if (validate(harvest)) {
          return element.farm.harvest === harvest;
        }

        return element;
      })
      .filter(element => {
        if (mill) {
          if (validate(mill)) {
            return element.farm.harvest.mill.id === mill;
          }

          return element.farm.harvest.mill.name === mill;
        }

        return element;
      });

    return res.json(filteredFields);
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
