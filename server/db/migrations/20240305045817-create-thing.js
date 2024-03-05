'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Things', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        type: Sequelize.INTEGER,
      },
      thingName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      categoryId: {
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id',
        },
        type: Sequelize.INTEGER,
      },
      thingAddress: {
        type: Sequelize.STRING,
      },
      thingLat: {
        type: Sequelize.FLOAT,
      },
      thingLon: {
        type: Sequelize.FLOAT,
      },
      startDate: {
        defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE,
      },
      endDate: {
        type: Sequelize.DATE,
      },
      issuesCount: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      isApproved: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      inDeal: {
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
    await queryInterface.dropTable('Things')
  },
}
