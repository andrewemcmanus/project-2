'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class frequency extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.frequency.belongsTo(models.user);
    }
  };
  frequency.init({
    songid: DataTypes.INTEGER,
    frequency: DataTypes.FLOAT,
    average: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'frequency',
  });
  return frequency;
};
