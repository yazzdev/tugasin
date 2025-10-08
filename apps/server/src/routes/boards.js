const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const prisma = require('../db/client');
const validateBoard = require('../middleware/validateBoard');

// Create new board
router.post('/', async (req, res) => {
  try {
    const { id } = req.body;
    let boardId = id;

    // If no ID provided or ID already exists, generate new UUID
    if (!boardId) {
      boardId = uuidv4();
    } else {
      // Check if board with this ID already exists
      const existingBoard = await prisma.board.findUnique({
        where: { id: boardId }
      });
      if (existingBoard) {
        boardId = uuidv4(); // Generate new ID if exists
      }
    }

    const board = await prisma.board.create({
      data: {
        id: boardId,
        name: 'Untitled Board'
      }
    });

    res.status(201).json({ board, columns: [] });
  } catch (error) {
    console.error('Error creating board:', error);
    if (error.code === 'P2002') {
      // Handle unique constraint error by generating new ID
      try {
        const boardId = uuidv4();
        const board = await prisma.board.create({
          data: {
            id: boardId,
            name: 'Untitled Board'
          }
        });
        res.status(201).json({ board, columns: [] });
      } catch (innerError) {
        console.error('Error creating board with new ID:', innerError);
        res.status(500).json({ error: 'Failed to create board' });
      }
    } else {
      res.status(500).json({ error: 'Failed to create board' });
    }
  }
});

// Get board with columns and cards
router.get('/:boardId', validateBoard, async (req, res) => {
  try {
    const { boardId } = req.params;

    // Update lastActiveAt
    await prisma.board.update({
      where: { id: boardId },
      data: { lastActiveAt: new Date() }
    });

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        lastActiveAt: true,
        activeUsers: true
      }
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    // Fixed: Use only select, not both include and select
    const columns = await prisma.column.findMany({
      where: { boardId },
      orderBy: { position: 'asc' },
      select: {
        id: true,
        title: true,
        position: true,
        createdAt: true,
        updatedAt: true,
        cards: {
          orderBy: { position: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            position: true,
            dueDate: true,
            completed: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
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
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Board not found' });
    }
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
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Board not found' });
    }
    res.status(500).json({ error: 'Failed to delete board' });
  }
});

module.exports = router;