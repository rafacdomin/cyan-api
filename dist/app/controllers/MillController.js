"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _AppError = require('../../errors/AppError'); var _AppError2 = _interopRequireDefault(_AppError);
var _Mill = require('../models/Mill'); var _Mill2 = _interopRequireDefault(_Mill);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);

exports. default = {
  async store(req, res) {
    const { name } = req.body;

    const user = await _User2.default.findByPk(req.user_id);

    if (!user) {
      throw new (0, _AppError2.default)("User doesn't exist");
    }

    const mill = await _Mill2.default.create({
      name,
      user_id: req.user_id,
    });

    return res.json(mill);
  },

  async index(req, res) {
    const mills = await _Mill2.default.findAll({
      include: {
        association: 'harvests',
        include: { association: 'farms', include: { association: 'fields' } },
      },
    });

    return res.json(mills);
  },

  async update(req, res) {
    const { name } = req.body;
    const { mill_id } = req.params;

    const mill = await _Mill2.default.findByPk(mill_id);

    if (!mill) {
      throw new (0, _AppError2.default)("Mill doesn't  exist", 401);
    }

    if (mill.user_id !== req.user_id) {
      throw new (0, _AppError2.default)("User don't have permission", 401);
    }

    await mill.update({ name });

    return res.json(mill);
  },

  async delete(req, res) {
    const { mill_id } = req.params;

    const mill = await _Mill2.default.findByPk(mill_id);

    if (!mill) {
      throw new (0, _AppError2.default)("Mill doesn't  exist", 401);
    }

    if (mill.user_id !== req.user_id) {
      throw new (0, _AppError2.default)("User doesn't have permission", 401);
    }

    await mill.destroy();

    return res.send();
  },
};
