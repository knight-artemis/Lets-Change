'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Deal extends Model {
    static associate({
      Message, Thing, User, ThingDeal,
    }) {
      this.hasMany(Message, { foreignKey: 'dealId' })
      this.belongsTo(Thing, { foreignKey: 'thingId' })
      this.belongsTo(User, { foreignKey: 'initiatorId' })
      this.hasMany(ThingDeal, { foreignKey: 'dealId' })
    }
  }
  Deal.init(
    {
      thingId: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      initiatorId: DataTypes.INTEGER,
      acceptedByInitiator: DataTypes.BOOLEAN,
      acceptedByReceiver: DataTypes.BOOLEAN,
      recieverNote: DataTypes.BOOLEAN,
      initiatorNote: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Deal',
    },
  )
  return Deal
}
