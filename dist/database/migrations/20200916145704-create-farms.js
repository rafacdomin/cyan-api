"use strict";module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('farms', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      harvest_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'harvests', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('farms');
  },
};
