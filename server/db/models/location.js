'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {

    static associate({Thing, User}) {
      this.hasMany(Thing, { foreignKey: 'thingLocationId' })
      this.hasMany(User, { foreignKey: 'userLocationId' })
    }
  }
  Location.init({
    address: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lon: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Location',
  });
  return Location;
};