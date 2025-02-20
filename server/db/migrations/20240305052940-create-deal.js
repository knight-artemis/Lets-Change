'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Deals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      thingId: {
        allowNull: false,
        references: {
          model: 'Things',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        type: Sequelize.INTEGER,
      },
      status: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      initiatorId: {
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        type: Sequelize.INTEGER,
      },
      acceptedByInitiator: {
        type: Sequelize.BOOLEAN,
      },
      acceptedByReceiver: {
        type: Sequelize.BOOLEAN,
      },
      recieverNote: {
        defaultValue: true,
        type: Sequelize.BOOLEAN,
      },
      initiatorNote: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Deals')
  },
}
