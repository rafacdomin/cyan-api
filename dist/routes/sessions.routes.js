"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');

var _SessionController = require('../app/controllers/SessionController'); var _SessionController2 = _interopRequireDefault(_SessionController);

const sessionRoutes = _express.Router.call(void 0, );

sessionRoutes.post('/', _SessionController2.default.store);

exports. default = sessionRoutes;
