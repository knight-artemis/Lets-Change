'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Thing extends Model {

    static associate({ User, Photo, Location, Category, Deal, ThingDeal, UserThingsView, Issue, UserThingsFavorite }) {
      this.belongsTo(User, { foreignKey: 'userId' })
      this.hasMany(Photo, { foreignKey: 'thingId' })
      this.belongsTo(Location, { foreignKey: 'thingLocationId' })
      this.hasMany(Category, { foreignKey: 'Id' })
      this.hasMany(Deal, { foreignKey: 'thingId' })
      this.hasMany(ThingDeal, { foreignKey: 'offeredThingId' })
      this.hasMany(UserThingsView, { foreignKey: 'thingId' })
      this.hasMany(Issue, { foreignKey: 'thingId' })
      this.hasMany(UserThingsFavorite, { foreignKey: 'thingId' })
      this.belongsTo(Deal, { foreignKey: 'selectedThingId' })
      this.belongsToMany(Category, { through: 'ThingCategories', foreignKey: 'thingId'})
    }
  }
  Thing.init({
    userId: DataTypes.INTEGER,
    thingName: DataTypes.STRING,
    description: DataTypes.TEXT,
    categoryId: DataTypes.INTEGER,
    thingLocationId: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    issuesCount: DataTypes.INTEGER,
    isApproved: DataTypes.BOOLEAN,
    inDeal: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Thing',
  });
  return Thing;
};