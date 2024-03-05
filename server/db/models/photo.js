'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {

    static associate({Thing}) {
      this.belongsTo(Thing, { foreignKey: 'thingId'})
    }
  }
  Photo.init({
    thingId: DataTypes.INTEGER,
    photoUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Photo',
  });
  return Photo;
};