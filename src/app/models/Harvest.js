const { Sequelize, Model, DataTypes } = require('sequelize');

class Harvest extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
      },
      {
        sequelize,
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.Mill, { foreignKey: 'mill_id', as: 'mill' });
  }
}

module.exports = Harvest;
