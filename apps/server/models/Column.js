const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Column = sequelize.define('Column', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'columns',
  timestamps: true
});

module.exports = Column;