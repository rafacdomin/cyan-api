"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');

var _MillController = require('../app/controllers/MillController'); var _MillController2 = _interopRequireDefault(_MillController);
var _HarvestController = require('../app/controllers/HarvestController'); var _HarvestController2 = _interopRequireDefault(_HarvestController);
var _FarmController = require('../app/controllers/FarmController'); var _FarmController2 = _interopRequireDefault(_FarmController);
var _FieldController = require('../app/controllers/FieldController'); var _FieldController2 = _interopRequireDefault(_FieldController);
var _auth = require('../app/middlewares/auth'); var _auth2 = _interopRequireDefault(_auth);

const mapRoutes = _express.Router.call(void 0, );

mapRoutes.post('/mills', _auth2.default, _MillController2.default.store);
mapRoutes.get('/mills', _MillController2.default.index);
mapRoutes.put('/mills/:mill_id', _auth2.default, _MillController2.default.update);
mapRoutes.delete('/mills/:mill_id', _auth2.default, _MillController2.default.delete);

mapRoutes.post('/harvests', _auth2.default, _HarvestController2.default.store);
mapRoutes.get('/harvests', _HarvestController2.default.index);
mapRoutes.put(
  '/harvests/:harvest_id',
  _auth2.default,
  _HarvestController2.default.update,
);
mapRoutes.delete(
  '/harvests/:harvest_id',
  _auth2.default,
  _HarvestController2.default.delete,
);

mapRoutes.post('/farms', _auth2.default, _FarmController2.default.store);
mapRoutes.get('/farms', _FarmController2.default.index);
mapRoutes.put('/farms/:farm_id', _auth2.default, _FarmController2.default.update);
mapRoutes.delete('/farms/:farm_id', _auth2.default, _FarmController2.default.delete);

mapRoutes.post('/fields', _auth2.default, _FieldController2.default.store);
mapRoutes.get('/fields', _FieldController2.default.index);
mapRoutes.put('/fields/:field_id', _auth2.default, _FieldController2.default.update);
mapRoutes.delete('/fields/:field_id', _auth2.default, _FieldController2.default.delete);

exports. default = mapRoutes;
