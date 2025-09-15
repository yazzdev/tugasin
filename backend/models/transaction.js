'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, { foreignKey: 'userId' });
      Transaction.belongsTo(models.Category, { foreignKey: 'categoryId' });
    }
  }
  Transaction.init({
    title: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    type: DataTypes.STRING,
    date: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};