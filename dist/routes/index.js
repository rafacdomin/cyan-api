"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');

var _sessionsroutes = require('./sessions.routes'); var _sessionsroutes2 = _interopRequireDefault(_sessionsroutes);
var _userroutes = require('./user.routes'); var _userroutes2 = _interopRequireDefault(_userroutes);
var _maproutes = require('./map.routes'); var _maproutes2 = _interopRequireDefault(_maproutes);

const routes = _express.Router.call(void 0, );

routes.use('/sessions', _sessionsroutes2.default);
routes.use('/users', _userroutes2.default);
routes.use('/map', _maproutes2.default);

exports. default = routes;
