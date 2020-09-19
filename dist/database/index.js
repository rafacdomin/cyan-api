"use strict";const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const User = require('../app/models/User');
const Mill = require('../app/models/Mill');
const Harvest = require('../app/models/Harvest');
const Farm = require('../app/models/Farm');
const Field = require('../app/models/Field');

const connection = new Sequelize(dbConfig);

User.init(connection);
Mill.init(connection);
Harvest.init(connection);
Farm.init(connection);
Field.init(connection);

Mill.associate(connection.models);
Harvest.associate(connection.models);
Farm.associate(connection.models);
Field.associate(connection.models);

module.exports = connection;
