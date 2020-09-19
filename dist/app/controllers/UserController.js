"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _bcryptjs = require('bcryptjs');
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _AppError = require('../../errors/AppError'); var _AppError2 = _interopRequireDefault(_AppError);

exports. default = {
  async store(req, res) {
    const { name, email, password } = req.body;

    const userExists = await _User2.default.findOne({ where: { email } });

    if (userExists) {
      throw new (0, _AppError2.default)('Email address already used');
    }

    const passwordHash = await _bcryptjs.hash.call(void 0, password, 8);

    let user = await _User2.default.create({
      name,
      email,
      password: passwordHash,
    });

    user = user.toJSON();

    delete user.password;

    return res.json(user);
  },
};
