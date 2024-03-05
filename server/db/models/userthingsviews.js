'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserThingsViews extends Model {

    static associate({Thing, User}) {
      this.belongsTo(Thing, { foreignKey: 'thingId' })
      this.belongsTo(User, { foreignKey: 'userId' })
    }
  }
  UserThingsViews.init({
    thingId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserThingsViews',
  });
  return UserThingsViews;
};