const Board = require('./Board');
const Column = require('./Column');
const Card = require('./Card');

// Associations
Board.hasMany(Column, {
  foreignKey: 'boardId',
  onDelete: 'CASCADE',
  hooks: true
});
Column.belongsTo(Board, { foreignKey: 'boardId' });

Column.hasMany(Card, {
  foreignKey: 'columnId',
  onDelete: 'CASCADE',
  hooks: true
});
Card.belongsTo(Column, { foreignKey: 'columnId' });

module.exports = { Board, Column, Card };