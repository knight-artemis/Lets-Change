'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {

    static associate({User, Deal}) {
      this.belongsTo(User, { foreignKey: 'userId' })
      this.belongsTo(Deal, { foreignKey: 'dealId' })
    }
  }
  Message.init({
    userId: DataTypes.INTEGER,
    text: DataTypes.TEXT,
    dealId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};