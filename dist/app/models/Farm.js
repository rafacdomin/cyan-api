"use strict";const { Sequelize, Model, DataTypes } = require('sequelize');

class Farm extends Model {
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
    this.belongsTo(models.Harvest, { foreignKey: 'harvest_id', as: 'harvest' });
    this.hasMany(models.Field, { foreignKey: 'farm_id', as: 'fields' });
  }
}

module.exports = Farm;
