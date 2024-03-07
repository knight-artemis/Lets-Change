'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      middleName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      userAddress: {
        type: Sequelize.STRING,
      },
      userLat: {
        type: Sequelize.FLOAT,
      },
      userLon: {
        type: Sequelize.FLOAT,
      },
      phone: {
        type: Sequelize.STRING,
      },
      avatarUrl: {
        type: Sequelize.STRING,
      },
      dealsCount: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      charityCount: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      thingsCount: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      subStatus: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      subExp: {
        type: Sequelize.DATE,
      },
      rating: {
        defaultValue: 5,
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Users')
  },
}
