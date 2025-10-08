const { Board, Column, Card } = require('../models/associations');
const { v4: uuidv4 } = require('uuid');

const boardController = {
  // Create new board
  createBoard: async (req, res) => {
    try {
      const board = await Board.create({
        name: req.body.name || 'Untitled Board'
      });

      // Create default columns
      await Column.bulkCreate([
        {
          id: uuidv4(),
          title: 'To Do',
          position: 0,
          boardId: board.id
        },
        {
          id: uuidv4(),
          title: 'In Progress',
          position: 1,
          boardId: board.id
        },
        {
          id: uuidv4(),
          title: 'Done',
          position: 2,
          boardId: board.id
        }
      ]);

      res.status(201).json(board);
    } catch (error) {
      console.error('Create board error:', error);
      res.status(500).json({ error: 'Failed to create board' });
    }
  },

  // Get board with columns and cards
  getBoard: async (req, res) => {
    try {
      const board = await Board.findByPk(req.params.id, {
        include: [
          {
            model: Column,
            include: [Card],
            order: [[Column, 'position', 'ASC']],
            separate: true
          }
        ],
        order: [
          [Column, 'position', 'ASC'],
          [Column, Card, 'position', 'ASC']
        ]
      });

      if (!board) {
        return res.status(404).json({ error: 'Board not found' });
      }

      res.json(board);
    } catch (error) {
      console.error('Get board error:', error);
      res.status(500).json({ error: 'Failed to fetch board' });
    }
  },

  // Update board
  updateBoard: async (req, res) => {
    try {
      const [updated] = await Board.update(req.body, {
        where: { id: req.params.id }
      });

      if (updated) {
        const updatedBoard = await Board.findByPk(req.params.id);
        res.json(updatedBoard);
      } else {
        res.status(404).json({ error: 'Board not found' });
      }
    } catch (error) {
      console.error('Update board error:', error);
      res.status(500).json({ error: 'Failed to update board' });
    }
  },

  // Delete board (cascades to columns and cards)
  deleteBoard: async (req, res) => {
    try {
      const deleted = await Board.destroy({
        where: { id: req.params.id }
      });

      if (deleted) {
        res.status(200).json({ message: 'Board deleted successfully' });
      } else {
        res.status(404).json({ error: 'Board not found' });
      }
    } catch (error) {
      console.error('Delete board error:', error);
      res.status(500).json({ error: 'Failed to delete board' });
    }
  }
};

module.exports = boardController;