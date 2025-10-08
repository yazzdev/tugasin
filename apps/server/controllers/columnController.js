const { Column, Card } = require('../models/associations');
const { v4: uuidv4 } = require('uuid');

const columnController = {
  // Get columns for a board
  getColumns: async (req, res) => {
    try {
      const columns = await Column.findAll({
        where: { boardId: req.params.boardId },
        include: [Card],
        order: [['position', 'ASC']]
      });

      res.json(columns);
    } catch (error) {
      console.error('Get columns error:', error);
      res.status(500).json({ error: 'Failed to fetch columns' });
    }
  },

  // Create column
  createColumn: async (req, res) => {
    try {
      const { title, boardId } = req.body;

      // Get the position for the new column
      const existingColumns = await Column.findAll({
        where: { boardId },
        order: [['position', 'DESC']],
        limit: 1
      });

      const newPosition = existingColumns.length > 0
        ? existingColumns[0].position + 1
        : 0;

      const column = await Column.create({
        id: uuidv4(),
        title,
        position: newPosition,
        boardId
      });

      res.status(201).json(column);
    } catch (error) {
      console.error('Create column error:', error);
      res.status(500).json({ error: 'Failed to create column' });
    }
  },

  // Update column
  updateColumn: async (req, res) => {
    try {
      const [updated] = await Column.update(req.body, {
        where: { id: req.params.id }
      });

      if (updated) {
        const updatedColumn = await Column.findByPk(req.params.id);
        res.json(updatedColumn);
      } else {
        res.status(404).json({ error: 'Column not found' });
      }
    } catch (error) {
      console.error('Update column error:', error);
      res.status(500).json({ error: 'Failed to update column' });
    }
  },

  // Delete column (cascades to cards)
  deleteColumn: async (req, res) => {
    try {
      const deleted = await Column.destroy({
        where: { id: req.params.id }
      });

      if (deleted) {
        res.status(200).json({ message: 'Column deleted successfully' });
      } else {
        res.status(404).json({ error: 'Column not found' });
      }
    } catch (error) {
      console.error('Delete column error:', error);
      res.status(500).json({ error: 'Failed to delete column' });
    }
  },

  // Update column positions
  updateColumnPositions: async (req, res) => {
    try {
      const { columns } = req.body;

      for (const columnData of columns) {
        await Column.update(
          { position: columnData.position },
          { where: { id: columnData.id } }
        );
      }

      res.json({ message: 'Column positions updated' });
    } catch (error) {
      console.error('Update column positions error:', error);
      res.status(500).json({ error: 'Failed to update column positions' });
    }
  }
};

module.exports = columnController;