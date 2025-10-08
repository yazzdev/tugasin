const { Board } = require('../models/associations');

const validateBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id || req.body.boardId || req.query.boardId;

    if (!boardId) {
      return res.status(400).json({ error: 'Board ID is required' });
    }

    const board = await Board.findByPk(boardId);
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    // Update last active timestamp
    await board.update({ lastActiveAt: new Date() });

    req.board = board;
    next();
  } catch (error) {
    console.error('Board validation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = validateBoard;