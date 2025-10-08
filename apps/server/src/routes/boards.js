const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const prisma = require('../db/client');
const validateBoard = require('../middleware/validateBoard');

// Create new board
router.post('/', async (req, res) => {
  try {
    const { id } = req.body;
    const boardId = id || uuidv4();

    const board = await prisma.board.create({
      data: {
        id: boardId,
        name: 'Untitled Board'
      }
    });

    res.status(201).json({ board, columns: [] });
  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({ error: 'Failed to create board' });
  }
});

// Get board with columns and cards
router.get('/:boardId', validateBoard, async (req, res) => {
  try {
    const { boardId } = req.params;

    const board = await prisma.board.findUnique({
      where: { id: boardId }
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const columns = await prisma.column.findMany({
      where: { boardId },
      include: {
        cards: {
          orderBy: { position: 'asc' }
        }
      },
      orderBy: { position: 'asc' }
    });

    res.json({ board, columns });
  } catch (error) {
    console.error('Error fetching board:', error);
    res.status(500).json({ error: 'Failed to fetch board' });
  }
});

// Update board
router.put('/:boardId', validateBoard, async (req, res) => {
  try {
    const { boardId } = req.params;
    const { name } = req.body;

    const board = await prisma.board.update({
      where: { id: boardId },
      data: { name }
    });

    res.json({ board });
  } catch (error) {
    console.error('Error updating board:', error);
    res.status(500).json({ error: 'Failed to update board' });
  }
});

// Delete board
router.delete('/:boardId', async (req, res) => {
  try {
    const { boardId } = req.params;

    await prisma.board.delete({
      where: { id: boardId }
    });

    res.status(200).json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Error deleting board:', error);
    res.status(500).json({ error: 'Failed to delete board' });
  }
});

module.exports = router;