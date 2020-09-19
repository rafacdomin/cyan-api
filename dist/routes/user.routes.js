"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _UserController = require('../app/controllers/UserController'); var _UserController2 = _interopRequireDefault(_UserController);

const userRoutes = _express.Router.call(void 0, );

userRoutes.post('/', _UserController2.default.store);

exports. default = userRoutes;
