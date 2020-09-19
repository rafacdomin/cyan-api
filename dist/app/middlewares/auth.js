"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _jsonwebtoken = require('jsonwebtoken');
var _util = require('util');

var _auth = require('../../config/auth'); var _auth2 = _interopRequireDefault(_auth);
var _AppError = require('../../errors/AppError'); var _AppError2 = _interopRequireDefault(_AppError);

exports. default = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new (0, _AppError2.default)('Token not provided', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decode = await _util.promisify.call(void 0, (0, _jsonwebtoken.verify))(token, _auth2.default.jwt.secret);

    req.user_id = decode.sub;
  } catch (err) {
    throw new (0, _AppError2.default)('Token invalid', 401);
  }

  return next();
};
