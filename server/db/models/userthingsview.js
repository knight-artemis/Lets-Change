'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserThingsView extends Model {
    static associate({ Thing, User }) {
      this.belongsTo(Thing, { foreignKey: 'thingId' });
      this.belongsTo(User, { foreignKey: 'userId' });
    }
  }
  UserThingsView.init(
    {
      thingId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'UserThingsView',
    },
  );
  return UserThingsView;
};
