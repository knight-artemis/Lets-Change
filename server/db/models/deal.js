'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Deal extends Model {

    static associate({ Message, Thing, User, ThingDeal }) {
      this.hasMany(Message, { foreignKey: 'dealId' })
      this.belongsTo(Thing, { foreignKey: 'thingId' })
      this.belongsTo(User, { foreignKey: 'initiatorId' })
      this.hasMany(ThingDeal, { foreignKey: 'dealId' })
      this.belongsTo(Thing, { foreignKey: 'selectedThingId' })
    }
  }
  Deal.init({
    thingId: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    initiatorId: DataTypes.INTEGER,
    selectedThingId: DataTypes.INTEGER,
    acceptedByInitiator: DataTypes.BOOLEAN,
    acceptedByReceiver: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Deal',
  });
  return Deal;
};