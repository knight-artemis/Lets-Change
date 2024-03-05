'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Issue extends Model {

    static associate({ Thing, User }) {
      this.belongsTo(Thing, { foreignKey: 'thingId' })
      this.belongsTo(User, { foreignKey: 'badGuyId' })
      this.belongsTo(User, { foreignKey: 'victimId' })
    }
  }
  Issue.init({
    issue: DataTypes.TEXT,
    thingId: DataTypes.INTEGER,
    badGuyId: DataTypes.INTEGER,
    victimId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Issue',
  });
  return Issue;
};