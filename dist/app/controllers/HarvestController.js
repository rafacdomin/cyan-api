"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _AppError = require('../../errors/AppError'); var _AppError2 = _interopRequireDefault(_AppError);
var _Harvest = require('../models/Harvest'); var _Harvest2 = _interopRequireDefault(_Harvest);
var _Mill = require('../models/Mill'); var _Mill2 = _interopRequireDefault(_Mill);

exports. default = {
  async store(req, res) {
    const { start_date, end_date, mill_id } = req.body;

    const mill = await _Mill2.default.findByPk(mill_id);

    if (!mill) {
      throw new (0, _AppError2.default)("Mill doesn't exist");
    }

    if (req.user_id !== mill.user_id) {
      throw new (0, _AppError2.default)("User doesn't have permission", 401);
    }

    const harvest = await _Harvest2.default.create({
      start_date,
      end_date,
      mill_id,
    });

    return res.json(harvest);
  },
  async index(req, res) {
    const harvests = await _Harvest2.default.findAll({
      include: { association: 'farms', include: { association: 'fields' } },
    });

    return res.json(harvests);
  },

  async update(req, res) {
    const { start_date, end_date, mill_id } = req.body;
    const { harvest_id } = req.params;

    const harvest = await _Harvest2.default.findByPk(harvest_id, {
      include: { association: 'mill' },
    });

    if (!harvest) {
      throw new (0, _AppError2.default)("Harvest doesn't  exist", 401);
    }

    if (harvest.mill.user_id !== req.user_id) {
      throw new (0, _AppError2.default)("User doesn't have permission", 401);
    }

    if (mill_id) {
      const mill = await _Mill2.default.findByPk(mill_id);

      if (mill.user_id !== req.user_id) {
        throw new (0, _AppError2.default)("User doesn't have permission");
      }
    }

    await harvest.update({ start_date, end_date, mill_id });

    return res.json(harvest);
  },

  async delete(req, res) {
    const { harvest_id } = req.params;

    const harvest = await _Harvest2.default.findByPk(harvest_id, {
      include: { association: 'mill' },
    });

    if (!harvest) {
      throw new (0, _AppError2.default)("Harvest doesn't  exist", 401);
    }

    if (harvest.mill.user_id !== req.user_id) {
      throw new (0, _AppError2.default)("User doesn't have permission", 401);
    }

    await harvest.destroy();

    return res.send();
  },
};
