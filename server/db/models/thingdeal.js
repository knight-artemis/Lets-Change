'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class ThingDeal extends Model {
    static associate({ Deal, Thing }) {
      this.belongsTo(Deal, { foreignKey: 'dealId' })
      this.belongsTo(Thing, { foreignKey: 'offeredThingId' })
    }
  }
  ThingDeal.init(
    {
      dealId: DataTypes.INTEGER,
      offeredThingId: DataTypes.INTEGER,
      isSelected: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'ThingDeal',
    },
  )
  return ThingDeal
}
