const prisma = require('../db/client');

const validateBoard = async (req, res, next) => {
  const { boardId } = req.params;

  if (!boardId) {
    return res.status(400).json({ error: 'Board ID is required' });
  }

  try {
    // Check if board exists
    const board = await prisma.board.findUnique({
      where: { id: boardId }
    });

    if (!board) {
      // Create new board if it doesn't exist
      const newBoard = await prisma.board.create({
        data: {
          id: boardId,
          name: 'Untitled Board'
        }
      });
      req.board = newBoard;
    } else {
      // Update last active time
      const updatedBoard = await prisma.board.update({
        where: { id: boardId },
        data: { lastActiveAt: new Date() }
      });
      req.board = updatedBoard;
    }

    next();
  } catch (error) {
    console.error('Board validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = validateBoard;