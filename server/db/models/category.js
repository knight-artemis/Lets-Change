'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate({ Thing }) {
      this.hasMany(Thing, { foreignKey: 'categoryId' })
      this.belongsToMany(Thing, {
        through: 'ThingCategories',
        foreignKey: 'categoryId',
      })
    }
  }
  Category.init(
    {
      categoryTitle: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Category',
    },
  )
  return Category
}
