"use strict";const { Sequelize, Model, DataTypes } = require('sequelize');

class Mill extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        name: DataTypes.STRING,
      },
      {
        sequelize,
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.hasMany(models.Harvest, { foreignKey: 'mill_id', as: 'harvests' });
  }
}

module.exports = Mill;
