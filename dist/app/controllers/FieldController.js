"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _uuid = require('uuid');
var _AppError = require('../../errors/AppError'); var _AppError2 = _interopRequireDefault(_AppError);
var _Farm = require('../models/Farm'); var _Farm2 = _interopRequireDefault(_Farm);
var _Field = require('../models/Field'); var _Field2 = _interopRequireDefault(_Field);
var _Harvest = require('../models/Harvest'); var _Harvest2 = _interopRequireDefault(_Harvest);
var _Mill = require('../models/Mill'); var _Mill2 = _interopRequireDefault(_Mill);

exports. default = {
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

    let newMill = await _Mill2.default.findOne({ where: { name: mill, user_id } });

    if (_uuid.validate.call(void 0, mill)) {
      newMill = await _Mill2.default.findByPk(mill);

      if (newMill && newMill.user_id !== user_id) {
        throw new (0, _AppError2.default)('User unathourized', 401);
      }
    }

    if (!newMill) {
      try {
        newMill = await _Mill2.default.create({ name: mill, user_id });
      } catch (err) {
        throw new (0, _AppError2.default)('Name must be unique');
      }
    }

    // Harvest Validation

    let newHarvest = _Harvest2.default.build({
      start_date,
      end_date,
      mill_id: newMill.id,
    });

    if (harvest) {
      newHarvest = await _Harvest2.default.findByPk(harvest, {
        include: { association: 'mill' },
      });

      if (newHarvest && newHarvest.mill.user_id !== user_id) {
        throw new (0, _AppError2.default)('User unathourized', 401);
      }

      if (!newHarvest) {
        newHarvest = await _Harvest2.default.create({
          start_date,
          end_date,
          mill_id: newMill.id,
        });
      }
    } else {
      await newHarvest.save();
    }

    // Farm Validation

    let newFarm = await _Farm2.default.findOne({
      where: { name: farm },
      include: {
        association: 'harvest',
        include: { association: 'mill' },
      },
    });

    if (newFarm && newFarm.harvest.mill.user_id !== user_id) {
      newFarm = null;
    }

    if (_uuid.validate.call(void 0, farm)) {
      newFarm = await _Farm2.default.findByPk(farm, {
        include: {
          association: 'harvest',
          include: { association: 'mill' },
        },
      });

      if (newFarm && newFarm.harvest.mill.user_id !== user_id) {
        throw new (0, _AppError2.default)('User unathourized', 401);
      }
    }

    if (!newFarm) {
      newFarm = await _Farm2.default.create({ name: farm, harvest_id: newHarvest.id });
    }

    // Field Validation

    const newField = _Field2.default.build({
      geography: { type: 'Point', coordinates: [latitude, longitude] },
      farm_id: newFarm.id,
    });

    try {
      await newField.save();
    } catch (err) {
      throw new (0, _AppError2.default)('Latitude and Longitude must be unique');
    }

    const notification = {
      id: _uuid.v4.call(void 0, ),
      message: `New Field added on Farm: ${newFarm.name}, Mill: ${newMill.name}`,
      position: {
        lat: newField.geography.coordinates[0],
        lng: newField.geography.coordinates[1],
      },
    };

    req.io.emit('notification', notification);

    return res.json(newField);
  },

  async index(req, res) {
    const { mill, farm, field, harvest, start_date, end_date } = req.query;

    const fields = await _Field2.default.findAll({
      include: {
        association: 'farm',
        include: { association: 'harvest', include: { association: 'mill' } },
      },
    });

    const filteredFields = fields
      .filter(element => {
        if (_uuid.validate.call(void 0, field)) {
          return element.id === field;
        }
        return element;
      })
      .filter(element => {
        if (farm) {
          if (_uuid.validate.call(void 0, farm)) {
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
        if (_uuid.validate.call(void 0, harvest)) {
          return element.farm.harvest === harvest;
        }

        return element;
      })
      .filter(element => {
        if (mill) {
          if (_uuid.validate.call(void 0, mill)) {
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

    const field = await _Field2.default.findByPk(field_id, {
      include: {
        association: 'farm',
        include: { association: 'harvest', include: { association: 'mill' } },
      },
    });

    if (!field) {
      throw new (0, _AppError2.default)("Field doesn't  exist", 401);
    }

    if (field.farm.harvest.mill.user_id !== req.user_id) {
      throw new (0, _AppError2.default)("User doesn't have permission", 401);
    }

    if (farm_id) {
      const farm = await _Farm2.default.findByPk(farm_id, {
        include: { association: 'harvest', include: { association: 'mill' } },
      });

      if (farm.harvest.mill.user_id !== req.user_id) {
        throw new (0, _AppError2.default)("User doesn't have permission");
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

    const field = await _Field2.default.findByPk(field_id, {
      include: {
        association: 'farm',
        include: { association: 'harvest', include: { association: 'mill' } },
      },
    });

    if (!field) {
      throw new (0, _AppError2.default)("Field doesn't  exist", 401);
    }

    if (field.farm.harvest.mill.user_id !== req.user_id) {
      throw new (0, _AppError2.default)("User doesn't have permission", 401);
    }

    await field.destroy();

    return res.send();
  },
};
