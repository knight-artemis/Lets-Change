'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserThingsFavorite extends Model {

    static associate({Thing, User}) {
      this.belongsTo(Thing, { foreignKey: 'thingId' })
      this.belongsTo(User, { foreignKey: 'userId' })
    }
  }
  UserThingsFavorite.init({
    thingId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserThingsFavorite',
  });
  return UserThingsFavorite;
};