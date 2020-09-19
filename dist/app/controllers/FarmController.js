"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _AppError = require('../../errors/AppError'); var _AppError2 = _interopRequireDefault(_AppError);
var _Farm = require('../models/Farm'); var _Farm2 = _interopRequireDefault(_Farm);
var _Harvest = require('../models/Harvest'); var _Harvest2 = _interopRequireDefault(_Harvest);

exports. default = {
  async store(req, res) {
    const { name, harvest_id } = req.body;

    const harvest = await _Harvest2.default.findByPk(harvest_id, {
      include: { association: 'mill' },
    });

    if (!harvest) {
      throw new (0, _AppError2.default)("Harvest doesn't exist");
    }

    if (req.user_id !== harvest.mill.user_id) {
      throw new (0, _AppError2.default)("User doesn't have permission", 401);
    }

    const farm = await _Farm2.default.create({
      name,
      harvest_id,
    });

    return res.json(farm);
  },
  async index(req, res) {
    const farms = await _Farm2.default.findAll({ include: { association: 'fields' } });

    return res.json(farms);
  },

  async update(req, res) {
    const { name, harvest_id } = req.body;
    const { farm_id } = req.params;

    const farm = await _Farm2.default.findByPk(farm_id, {
      include: { association: 'harvest', include: { association: 'mill' } },
    });

    if (!farm) {
      throw new (0, _AppError2.default)("Harvest doesn't  exist", 401);
    }

    if (farm.harvest.mill.user_id !== req.user_id) {
      throw new (0, _AppError2.default)("User doesn't have permission", 401);
    }

    if (harvest_id) {
      const harvest = await _Harvest2.default.findByPk(harvest_id, {
        include: { association: 'mill' },
      });

      if (harvest.mill.user_id !== req.user_id) {
        throw new (0, _AppError2.default)("User doesn't have permission");
      }
    }

    await farm.update({ name, harvest_id });

    return res.json(farm);
  },

  async delete(req, res) {
    const { farm_id } = req.params;

    const farm = await _Farm2.default.findByPk(farm_id, {
      include: { association: 'harvest', include: { association: 'mill' } },
    });

    if (!farm) {
      throw new (0, _AppError2.default)("Farm doesn't  exist", 401);
    }

    if (farm.harvest.mill.user_id !== req.user_id) {
      throw new (0, _AppError2.default)("User doesn't have permission", 401);
    }

    await farm.destroy();

    return res.send();
  },
};
