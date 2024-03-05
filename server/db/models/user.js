'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Thing, Location, Message, Deal, UserThingsView, Issue, UserThingsFavorite }) {
      this.hasMany(Thing, { foreignKey: 'userId' })
      this.belongsTo(Location, { foreignKey: 'userLocationId' })
      this.hasMany(Message, { foreignKey: 'userId' })
      this.hasMany(Deal, { foreignKey: 'initiatorId' })
      this.hasMany(Issue, { foreignKey: 'badGuyId' })
      this.hasMany(Issue, { foreignKey: 'victimId' })
      this.hasMany(UserThingsView, { foreignKey: 'userId' })
      this.hasMany(UserThingsFavorite, { foreignKey: 'userId' })
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    userLocationId: DataTypes.INTEGER,
    phone: DataTypes.INTEGER,
    avatarUrl: DataTypes.STRING,
    dealsCount: DataTypes.INTEGER,
    charityCount: DataTypes.INTEGER,
    thingsCount: DataTypes.INTEGER,
    subStatus: DataTypes.BOOLEAN,
    subExp: DataTypes.DATE,
    rating: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};