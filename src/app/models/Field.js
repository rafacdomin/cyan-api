const { Sequelize, Model, DataTypes } = require('sequelize');

class Field extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        geography: DataTypes.GEOGRAPHY('POINT'),
      },
      {
        sequelize,
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.Farm, { foreignKey: 'farm_id', as: 'farm' });
  }
}

module.exports = Field;
