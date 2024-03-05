'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ThingCategory extends Model {

    static associate(models) {
      
    }
  }
  ThingCategory.init({
    thingId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ThingCategory',
  });
  return ThingCategory;
};