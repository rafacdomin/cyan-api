"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _bcryptjs = require('bcryptjs');
var _jsonwebtoken = require('jsonwebtoken');

var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _AppError = require('../../errors/AppError'); var _AppError2 = _interopRequireDefault(_AppError);
var _auth = require('../../config/auth'); var _auth2 = _interopRequireDefault(_auth);

exports. default = {
  async store(req, res) {
    const { email, password } = req.body;

    const userExists = await _User2.default.findOne({ where: { email } });

    if (!userExists) {
      throw new (0, _AppError2.default)("User doesn't exist");
    }

    const passwordMatches = await _bcryptjs.compare.call(void 0, password, userExists.password);

    if (!passwordMatches) {
      throw new (0, _AppError2.default)("User doesn't exist");
    }

    const user = userExists.toJSON();

    delete user.password;

    const token = _jsonwebtoken.sign.call(void 0, {}, _auth2.default.jwt.secret, {
      subject: user.id,
      expiresIn: _auth2.default.jwt.expiresIn,
    });

    return res.json({ user, token });
  },
};
