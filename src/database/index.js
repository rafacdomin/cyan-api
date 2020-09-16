const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const User = require('../app/models/User');
const Mill = require('../app/models/Mill');

const connection = new Sequelize(dbConfig);

User.init(connection);
Mill.init(connection);

Mill.associate(connection.models);

module.exports = connection;
